var app = angular.module('PomodoroApp', []);
app.controller('MainCtrl', function($scope, $interval) {
  // 设置初始休息时间段
  $scope.breakLength = 5;
  //设置初始工作时间段
  $scope.sessionLength = 25;
  // 设置初始剩余时间
  $scope.timeLeft = $scope.sessionLength;
  // 设置初始填充高度
  $scope.fillHeight = '0%';
  // 初始名称为"Session"即工作时段
  $scope.sessionName = 'Session';
  $scope.currentTotal;
  // 设置本时段时间是否用光标志
  var runTimer = false;
  // 剩余本时段秒数
  var secs = 60 * $scope.timeLeft;
  // 初始时间设置为初始默认的工作时长
  $scope.originalTime = $scope.sessionLength;

  //秒转化为时分秒
  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return (
      (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s
    ); 
  }
  
  // 重置工作时长
  $scope.sessionLengthChange = function(time) {
    // 如果本时段时间没有用光
    if (!runTimer){
      if ($scope.sessionName === 'Session' || 'Break!') {
        $scope.sessionLength += time;
        if ($scope.sessionLength < 1) {
          $scope.sessionLength = 1;
        }
        $scope.timeLeft = $scope.sessionLength;
        $scope.originalTime = $scope.sessionLength;
        secs = 60 * $scope.sessionLength;
      }
    }
  }
  
  // 重置休息时长
    $scope.breakLengthChange = function(time) {
    // 如果本时段时间没有用光
    if (!runTimer){
      if ($scope.sessionName === 'Session' || 'Break!') {
        $scope.breakLength += time;
        if ($scope.breakLength < 1) {
          $scope.breakLength = 1;
        }
        $scope.timeLeft = $scope.breakLength;
        $scope.originalTime = $scope.breakLength;
        secs = 60 * $scope.breakLength;
      }
    }
  }
  //点击后.toggleTimer()函数重置休息和工作时长
  $scope.toggleTimer = function() {
    if (!runTimer) {
      if ($scope.currentName === 'Sesson') {
        $scope.currentLength = $scope.sessionLength;
      } else {
        $scope.currentLength = $scope.breakLength;
      }
      
      updateTimer();
      runTimer = $interval(updateTimer, 1000);
    } else {
      $interval.cancel(runTimer);
      runTimer = false;
    }
  }
  
  function updateTimer() {
    secs -= 1;
    if (secs < 0) {     
      var wav = 'http://ou3oh86t1.bkt.clouddn.com/demo-pomodoroClock/music/Summer.mp3';
      var audio = new Audio(wav);    
      //休息和工作交替进行
      $scope.fillColor = '#333333';
      if ($scope.sessionName === 'Break!') {
        audio.pause();
        $scope.sessionName = 'Session';
        $scope.currentLength = $scope.sessionLength;
        $scope.timeLeft = 60 * $scope.sessionLength;
        $scope.originalTime = $scope.sessionLength;
        secs = 60 * $scope.sessionLength;
      } else {
        audio.play();
        $scope.sessionName = 'Break!';
        $scope.currentLength = $scope.breakLength;
        $scope.timeLeft = 60 * $scope.breakLength;
        $scope.originalTime = $scope.breakLength;
        secs = 60 * $scope.breakLength;
      }
    } else {
      if ($scope.sessionName === 'Break!') {
        $scope.fillColor = '#FF4444';
      } else {
        $scope.fillColor = '#99CC00';
      }
	    $scope.timeLeft = secondsToHms(secs);
      
      var denom = 60 * $scope.originalTime;
      var perc = Math.abs((secs / denom) * 100 - 100);
      $scope.fillHeight = perc + '%';
    }
  }
  
});