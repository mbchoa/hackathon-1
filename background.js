// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
document.addEventListener('DOMContentLoaded', function() {
  const tabsOpen = {};

  chrome.tabs.onCreated.addListener(function(tab) {
    tabsOpen[tab.id] = window.setInterval(function() {
      alert('Tab: ' + tab.title + ' has been open for a long time');
    }, 5000);
  });

  chrome.browserAction.onClicked.addListener(function(tab) {
    // No tabs or host permissions needed!
    window.clearInterval(tabsOpen[tab.id]);
  });
})
