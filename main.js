"use strict";

var search = document.getElementById("search");
var btn = document.getElementById("btn");
var searchForm = document.getElementById("searchForm");
var message = document.getElementById("message");
var emptyState = document.getElementById("emptyState");
var profileCard = document.getElementById("profileCard");
var img = document.getElementById("img");
var fullname = document.getElementById("fullname");
var username = document.getElementById("username");
var profileLink = document.getElementById("profileLink");
var profileType = document.getElementById("profileType");
var bio = document.getElementById("bio");
var details = document.getElementById("details");
var repos = document.getElementById("repos");
var followers = document.getElementById("followers");
var following = document.getElementById("following");
var gists = document.getElementById("gists");
var joined = document.getElementById("joined");
var blogLink = document.getElementById("blogLink");
var blogLabel = document.getElementById("blogLabel");
var defaultButtonLabel = btn.querySelector(".button-label").textContent;

var iconSvgs = {
  location: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="10" r="2.2" stroke="currentColor" stroke-width="1.7"/></svg>',
  company: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="7" width="16" height="13" rx="1.5" stroke="currentColor" stroke-width="1.7"/><path d="M9 7V4h6v3M8 11h2m4 0h2m-8 4h2m4 0h2M12 20v-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 5.5a7.7 7.7 0 0 1-2.2.6 3.8 3.8 0 0 0 1.7-2.1 7.6 7.6 0 0 1-2.4.9 3.8 3.8 0 0 0-6.5 3.5 10.8 10.8 0 0 1-7.8-4 3.8 3.8 0 0 0 1.2 5.1 3.8 3.8 0 0 1-1.7-.5v.1a3.8 3.8 0 0 0 3.1 3.7 3.8 3.8 0 0 1-1.7.1 3.8 3.8 0 0 0 3.5 2.6A7.7 7.7 0 0 1 2 17.3a10.8 10.8 0 0 0 16.6-9.1v-.5A7.7 7.7 0 0 0 21 5.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.7 1.7M14 10.5a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 19.2l1.7-1.7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
};

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  findProfile(search.value);
});

document.querySelectorAll(".quick-chip").forEach(function (chip) {
  chip.addEventListener("click", function () {
    search.value = chip.dataset.user;
    findProfile(search.value);
  });
});

function setMessage(text, type) {
  message.textContent = text || "";
  message.className = "message" + (type ? " is-" + type : "");
}

function setLoading(isLoading) {
  btn.disabled = isLoading;
  btn.querySelector(".button-label").textContent = isLoading ? "Searching..." : defaultButtonLabel;
  btn.querySelector(".button-arrow").style.display = isLoading ? "none" : "block";
  search.setAttribute("aria-busy", String(isLoading));
}

function safeExternalUrl(value) {
  if (!value || typeof value !== "string") return "";
  var candidate = value.trim();
  if (!candidate) return "";
  if (!/^https?:\/\//i.test(candidate)) candidate = "https://" + candidate;
  try {
    var parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    return parsed.href;
  } catch (error) {
    return "";
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "Not available";
  var date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
}

function addDetail(iconName, text, url) {
  if (!text) return;
  var item = document.createElement("div");
  item.className = "detail-pill";
  item.innerHTML = iconSvgs[iconName] || iconSvgs.link;

  if (url) {
    var link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = text;
    item.appendChild(link);
  } else {
    var span = document.createElement("span");
    span.textContent = text;
    item.appendChild(span);
  }
  details.appendChild(item);
}

function renderProfile(user) {
  var displayName = user.name && user.name.trim() ? user.name.trim() : user.login;
  fullname.textContent = displayName;
  username.textContent = "@" + user.login;
  username.href = user.html_url;
  profileLink.href = user.html_url;
  profileType.textContent = user.type ? user.type.toUpperCase() : "DEVELOPER";

  img.onerror = function () {
    img.onerror = null;
    img.src = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
  };
  img.src = user.avatar_url || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
  img.alt = displayName + "'s GitHub avatar";

  if (user.bio && user.bio.trim()) {
    bio.textContent = user.bio.trim();
    bio.classList.remove("is-empty");
  } else {
    bio.textContent = "No bio has been added to this profile yet.";
    bio.classList.add("is-empty");
  }

  details.replaceChildren();
  addDetail("company", user.company ? user.company.replace(/^@/, "") : "", "");
  addDetail("location", user.location || "", "");

  var blogUrl = safeExternalUrl(user.blog);
  if (blogUrl) addDetail("link", user.blog.replace(/^https?:\/\//i, "").replace(/\/$/, ""), blogUrl);

  if (user.twitter_username) {
    var twitterName = user.twitter_username.replace(/^@/, "");
    addDetail("twitter", "@" + twitterName, safeExternalUrl("https://twitter.com/" + encodeURIComponent(twitterName)));
  }

  repos.textContent = formatNumber(user.public_repos);
  followers.textContent = formatNumber(user.followers);
  following.textContent = formatNumber(user.following);
  gists.textContent = formatNumber(user.public_gists);
  joined.textContent = formatDate(user.created_at);

  if (blogUrl) {
    blogLink.href = blogUrl;
    blogLabel.textContent = user.blog.replace(/^https?:\/\//i, "").replace(/\/$/, "") || "Personal website";
    blogLink.hidden = false;
  } else {
    blogLink.hidden = true;
    blogLink.removeAttribute("href");
  }

  emptyState.hidden = true;
  profileCard.hidden = false;
}

function findProfile(rawUsername) {
  var githubUsername = String(rawUsername || "").trim().replace(/^@/, "");

  if (!githubUsername) {
    setMessage("Please enter a GitHub username first.", "error");
    search.focus();
    return;
  }

  profileCard.hidden = true;
  emptyState.hidden = false;
  setMessage("Connecting to GitHub and fetching profile data...", "loading");
  setLoading(true);

  var ajax = new XMLHttpRequest();
  ajax.open("GET", "https://api.github.com/users/" + encodeURIComponent(githubUsername), true);
  ajax.setRequestHeader("Accept", "application/vnd.github+json");
  ajax.setRequestHeader("X-GitHub-Api-Version", "2022-11-28");

  ajax.onreadystatechange = function () {
    if (ajax.readyState !== XMLHttpRequest.DONE) return;

    setLoading(false);

    if (ajax.status === 200) {
      try {
        var user = JSON.parse(ajax.responseText);
        renderProfile(user);
        setMessage("Profile loaded successfully.", "success");
      } catch (error) {
        setMessage("GitHub returned an unexpected response. Please try again.", "error");
      }
      return;
    }

    if (ajax.status === 404) {
      setMessage("We couldn't find a public profile named \"" + githubUsername + "\". Check the spelling and try again.", "error");
    } else if (ajax.status === 403 || ajax.status === 429) {
      setMessage("GitHub's unauthenticated API limit may have been reached. Wait a little and try again.", "error");
    } else if (ajax.status === 0) {
      setMessage("Couldn't connect to GitHub. Check your internet connection and try again.", "error");
    } else {
      setMessage("Something went wrong (HTTP " + ajax.status + "). Please try again.", "error");
    }
  };

  ajax.onerror = function () {
    setLoading(false);
    setMessage("Network error: couldn't reach GitHub. Check your connection and try again.", "error");
  };

  ajax.send();
}
