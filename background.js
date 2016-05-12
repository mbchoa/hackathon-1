// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
document.addEventListener('DOMContentLoaded', function() {
  const TAB_FEVER_TIMER_DELAY = 600000; // 10 minutes
  const TAB_FEVER_MAX_TAB_COUNT = 5;
  const MS_IN_MINUTE = 60000;
  const MS_IN_SECOND = 1000;
  const tabsOpen = {};
  let numTabsOpenIntervalId = 0;
  let numTabsOpen = 0;

  function timeValueToString(timeVal) {
    if (timeVal >= MS_IN_MINUTE) {
      return Math.floor(timeVal / MS_IN_MINUTE) + ' minutes';
    } else {
      return Math.floor(timeVal / MS_IN_SECOND) + ' seconds';
    }
  }

  function handleOnCreateTab(tab) {
    numTabsOpen++;
    if (numTabsOpen >= TAB_FEVER_MAX_TAB_COUNT) {
      notify('Tab Fever', 'Warning you have ' + numTabsOpen + ' open tabs');
    }
    processTab(tab);
  }

  function processTab (tab) {
    storeTab(createTabTimer(tab.id, tab.title), tab);
  }

  function storeTab (tabTimerId, tab) {
    tabsOpen[tab.id] = {
      tabTimerId: tabTimerId,
      tabTitle: tab.title,
      tabUrl: tab.url
    };
  }

  function createTabTimer (tabId, tabTitle) {
    if (tabsOpen.hasOwnProperty(tabId)) {
      clearInterval(tabsOpen[tabId].tabTimerId);
    }
    return window.setInterval(() => {
      notify('Tab Fever',
        'Detected that ' + tabTitle + ' tab has been idle for more than ' + timeValueToString(TAB_FEVER_TIMER_DELAY));
    }, TAB_FEVER_TIMER_DELAY);
  }

  function handleExtensionBtnClicked(tab) {
    for (let tabId in tabsOpen) {
      window.clearInterval(tabsOpen[tabId].tabTimerId);
    }
    window.clearInterval(numTabsOpenIntervalId);
  }
  
  function handleTabClosed(tabId, removeInfo) {
    numTabsOpen--;
    if (tabsOpen.hasOwnProperty(tabId)) {
      window.clearInterval(tabsOpen[tabId].tabTimerId);
      delete tabsOpen[tabId];
    }
    if (numTabsOpen < TAB_FEVER_MAX_TAB_COUNT) {
      window.clearInterval(numTabsOpenIntervalId);
      numTabsOpenIntervalId = 0;
    }
  }

  function clearAllTimers () {
    clearInterval(numTabsOpenIntervalId);
    for (let tabId in tabsOpen) {
      clearInterval(tabsOpen[tabId].tabTimerId);
    }
  }

  function handleGetAllTabs (result) {
    clearAllTimers();
    numTabsOpen = result.length;
    if (numTabsOpen >= TAB_FEVER_MAX_TAB_COUNT) {
      notify('Tab Fever', 'Warning you have ' + numTabsOpen + ' open tabs');
      result.forEach(tab => {
        processTab(tab);
      });
    }

    function handleTabUpdate (tabId, changeInfo, tab) {

    }

    function handleTabActivate(activeInfo) {
      if (tabsOpen.hasOwnProperty(activeInfo.tabId)) {
        // stop timer on active tab

      }
    }
    chrome.tabs.onCreated.addListener(handleOnCreateTab);
    chrome.tabs.onRemoved.addListener(handleTabClosed);
    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    chrome.tabs.onActivated.addListener(handleTabActivate);
    chrome.browserAction.onClicked.addListener(handleExtensionBtnClicked);
  }

  chrome.tabs.query({}, handleGetAllTabs);
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
