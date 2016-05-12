// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
document.addEventListener('DOMContentLoaded', function() {
  const tabsOpen = {};

  chrome.browserAction.onClicked.addListener(function(tab) {
    // chrome.pageAction.setIcon({tabId: tab.id, path: 'assets/circle_red.ico' });
    chrome.tabs.executeScript({
      // code: 'document.body.style.backgroundColor="red"'

      code: 'document.title="fever"'
      // code: 'document.head.link.class="testClass"'
    })
  })
})

    // tabsOpen[tab.id] = window.setInterval(function() {
    // var link = document.createElement('link');
    // link.type = 'image/x-icon';
    // link.rel = 'shortcut icon';


    // link.href = 'assets/circle_red.ico';

