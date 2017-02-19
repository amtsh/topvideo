var YOUTUBE = angular.module('youtube-trends', ['youtube-embed'])

YOUTUBE.controller('main',
['$http', '$scope', '$sce', '$location',
function($http, $scope, $sce, $location) {
  $scope.videoID = false
  $scope.repeatMode = false
  $scope.playerVars = {
    controls: 1,
    autoplay: 1,
    fs: 1,
    showinfo: 1
  }
  $scope.loadVideo = function(video_id, autoplayOff) {
    toggleAutoplay(autoplayOff)
    $scope.videoID = video_id
  }

  $scope.activeRegion = ""
  $scope.activeCategory = ""
  $scope.nextPageToken = ""
  $scope.videos = []
  $scope.error = ""

  var _this = this

  _this.loadRegions = function() {
  console.log('Request: ' + '/api/regions/')

  $http.get('/api/regions')
    .then(function(response) {
      if (response.data.error) {
        $scope.error = response.data.error.message
      } else {
        console.log(response.data)
        $scope.regions = response.data.items
        $scope.selectedRegion = $scope.regions[0]
        $scope.changeActiveRegion($scope.selectedRegion)
      }

    }, function(response) {
      $scope.error = response;
    });
  }

  _this.loadCategoriesForRegion = function() {
    region = $scope.activeRegion
    console.log('Request: ' + '/api/categories/' + region)

    $http.get('/api/categories/' + region)
      .then(function(response) {
        if (response.data.error) {
          $scope.error = response.data.error.message
        } else {
          console.log(response)
          $scope.categories = response.data.items
          $scope.changeActiveCategory($scope.categories[2])
        }

      }, function(response) {
        $scope.error = response;
      });
  }

  _this.getTrendingVideos = function() {

    var region = $scope.activeRegion
    var category = $scope.activeCategory.id
    var nexttokenParam = $scope.nextPageToken ? '/' + $scope.nextPageToken : ""
    console.log('Request: ' + '/api/trending/' + region + '/' + category + nexttokenParam)

    $http.get('/api/trending/' + region + '/' + category + nexttokenParam)
      .then(function(response) {
        if (response.data.error) {
          console.log($scope.activeCategory);
          $scope.error = $scope.activeRegion + '-' + $scope.activeCategory.snippet.title + ' : ' + response.data.error.message
            // $scope.videos = null
        } else {
          $scope.error = null
          $scope.nextPageToken = response.data.nextPageToken || ""
          $scope.videos = $scope.videos.concat(response.data.items)
          // console.log($scope.nextPageToken)
          console.log($scope.videos);
          _this.loadVideoFromURL()
        }
      }, function(response) {
        $scope.error = response;
      });
  }

  $scope.searchYoutube = function() {
    var query = $scope.searchQuery
    if (!query || query == '') { return }

    console.log('/api/search/' + query)
    $http.get('/api/search/' + query)
      .then(function(response) {
        if (response.data.error) {

        } else {
          $scope.error = null
          console.log(response.data.items[0])
          var video_id = response.data.items[0].id.videoId
          $scope.loadVideo(video_id)
          $location.url('/player?v='+video_id)
        }
      }, function(response) {
        $scope.error = response;
      });
  }


  $scope.changeActiveCategory = function(category) {
    $scope.activeCategory = category
    $scope.videos = []
    _this.getTrendingVideos()
  }

  $scope.changeActiveRegion = function() {
    $scope.activeRegion = $scope.selectedRegion.id
    _this.loadCategoriesForRegion()
  }

  $scope.getVideoUrl = function(url) {
    return $sce.trustAsResourceUrl("//www.youtube.com/embed/" + url);
  }

  $scope.setRepeatMode = function() {
    $scope.repeatMode = !$scope.repeatMode
  }

  var toggleAutoplay = function(autoplayOff) {
    if (autoplayOff) {
      $scope.playerVars.autoplay = 0
    }
    else {
     $scope.playerVars.autoplay = 1
    }
  }

   $scope.playNext = function() {
    var nextVideo = getNextVideo()

    if (nextVideo !== undefined) {
      $scope.loadVideo(nextVideo.id)
    }
    else {
     $scope.loadVideo($scope.videos[0].id)
    }
  }

  function getNextVideo() {
    var video_id = $scope.videoID
    var videos = $scope.videos

    var currentIndex = videos.map(function(obj) {return obj.id; }).indexOf(video_id);
    var nextIndex = currentIndex + 1
    return videos[nextIndex]
  }


  $scope.$on('youtube.player.ended', function ($event, player) {
    if ($scope.repeatMode)
      player.playVideo()
    else
      $scope.playNext()
  })
  _this.loadVideoFromURL = function() {
    var url= $location.url()
    var urlArr = url.split('?')

    if (urlArr[1]) {
      urlArr = urlArr[1].split('=')
      var video = urlArr[1]
      if (urlArr[1]) {
        $scope.loadVideo(video, true)
      }
    }
  }

  _this.loadRegions()

}])

