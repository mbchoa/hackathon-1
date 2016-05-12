// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
document.addEventListener('DOMContentLoaded', function() {
  const tabsOpen = {};
  let numTabsOpenIntervalId = 0;
  let numTabsOpen = 0;

  chrome.tabs.onCreated.addListener(function(tab) {
    numTabsOpen++;
    if (numTabsOpen >= 5) {
      if (numTabsOpenIntervalId === 0) {
        notify('Tab Fever', 'Warning you have ' + numTabsOpen + ' open tabs');
        numTabsOpenIntervalId = window.setInterval(function() {
          notify('Tab Fever', 'Warning you have ' + numTabsOpen + ' open tabs');
        }, 5000);
      }
    }
  });

  chrome.browserAction.onClicked.addListener(function(tab) {
    // No tabs or host permissions needed!
    for (let tabId in tabsOpen) {
      window.clearInterval(tabsOpen[tabId]);
    }
    clearInterval(numTabsOpenIntervalId);
  });

  // add handler when tab is closed
  chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    clearInterval(tabsOpen[tabId]);
    numTabsOpen--;
    if (numTabsOpen < 5) {
      clearInterval(numTabsOpenIntervalId);
    }
  });
})

function notify(title, message) {
  chrome.notifications.create(getNotificationId(), {
    title: title,
    iconUrl: 'background.png',
    type: 'basic',
    message: message
  }, function() {});
}

function getNotificationId() {
  var id = Math.floor(Math.random() * 9007199254740992) + 1;
  return id.toString();
}
