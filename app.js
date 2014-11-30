(function () {

  var screenTimeout = document.querySelector('#screen-timeout');
  var remoteDebugging = document.querySelector('#remote-debugging');
  var restoreButton = document.querySelector('#restore-settings');

  var currentPreferences = {
  	screenTimeout: null,
  	remoteDebugging: null
  };

  addEventListeners();
  backupInitialValues();

  function addEventListeners() {
    screenTimeout.addEventListener('click', toggleScreenTimeout, false);
    remoteDebugging.addEventListener('click', toggleRemoteDebugging, false);
    restoreButton.addEventListener('click', restoreInitialValues, false);
  }

  function backupInitialValues() {
  	console.log('Backing up settings...');
  	var settingsLock = navigator.mozSettings.createLock();
  	var setting = settingsLock.get('screen.timeout');
  	setting.onsuccess = function () {
      localStorage.setItem('initScreenTimeout', setting.result);
  	};
  	setting.onerror = function () {
        console.log(setting.error);
  	}

    var settingsLock = navigator.mozSettings.createLock();
  	var setting = settingsLock.get('debugger.remote-mode');
  	setting.onsuccess = function () {
      localStorage.setItem('initRemoteDebugging', setting.result);
  	};
  	setting.onerror = function () {
        console.log(setting.error);
  	};
  }

  function restoreInitialValues() {
  	console.log('Restoring backed up values...');
  	var settingsLock = navigator.mozSettings.createLock();
    var result = settingsLock.set({
      'screen.timeout': localStorage.getItem('initScreenTimeout'),
      'debugger.remote-mode': localStorage.getItem('initRemoteDebugging')
    });

    result.onsuccess = function () {
      // TODO: info to user
      console.log('restored..');
    };
    result.onerror = function () {
      console.log('error...');
    };
  }

  function toggleScreenTimeout() {
  	console.log('Toggling Screen Timeout...');
  	var settingsLock = navigator.mozSettings.createLock();
  	var newValue = currentPreferences.screenTimeout == 0 ? localStorage.getItem('initScreenTimeout') : 0;
    var result = settingsLock.set({
      'screen.timeout': newValue
    });

    result.onsuccess = function () {
      screenTimeout.classList.toggle('prefEnabled');
      currentPreferences.screenTimeout = newValue;
    };
    result.onerror = function () {
        console.log('Error setting the preference..');
  	};
  }

  function toggleRemoteDebugging() {
  	console.log('Toggling Remote Debugging...');
  	var settingsLock = navigator.mozSettings.createLock();
    var newValue = currentPreferences.remoteDebugging == 'adb-devtools' ? localStorage.getItem('initRemoteDebugging') : 'adb-devtools';
    var result = settingsLock.set({
      'debugger.remote-mode': newValue
    });

    result.onsuccess = function () {
      remoteDebugging.classList.toggle('prefEnabled');
      currentPreferences.remoteDebugging = newValue;
    };
    result.onerror = function () {
        console.log('Error setting the preference..');
  	};
  }

}());