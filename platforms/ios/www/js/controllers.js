angular.module('starter.controllers', [])
    .controller('SearchCtrl', function ($scope, $ionicPopup, $location, Btspread,BlackWords,ParseConfig,$ionicLoading) {

        //check first run
        if (window.localStorage.getItem("AGREEMENT") != 1) {
            console.log('regdirect to agreement');
            $location.path("/tab/agreement");
        };

        if(ParseConfig.myConfig()==false){

        }

        $ionicLoading.show();
        ParseConfig.loadParseConfig().then(function(){
            BlackWords.loadServerBlackWords();
            $ionicLoading.hide();
            console.log('config loaded');
        },function(){
            $ionicLoading.hide();
            console.log('config failed to load');
        });


        $scope.showBlackWordSubmitForm = function(){

            if(window.localStorage.getItem('NG_TRANSLATE_LANG_KEY')=="zh-CN"){

            }

            $scope.data = {};
            $ionicPopup.show({
                template: '<input type="text" ng-model="data.word">',
                title: '请输入需要举报的关键词',
                scope: $scope,
                buttons: [
                    { text: '取消' },
                    {
                        text: '<b>提交</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            console.log($scope.data);
                            if (!$scope.data.word) {
                                e.preventDefault();
                            } else {
                                $scope.submitBlackWord($scope.data.word);
                                return $scope.data.word;
                            }
                        }
                    }
                ]
            });
        };

        $scope.submitBlackWord = function(word){
            console.log('submitting black word');
            var BlackWord = Parse.Object.extend("BlackWord");
            var query = new Parse.Query(BlackWord);
            query.equalTo("word", word);
            query.find({
                success: function(results) {
                    if(results.length==0){
                        var blackWord = new BlackWord();
                        blackWord.save({word:word},{
                            success: function(blackWord) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Info',
                                    template: "{{'Black word submitted'|translate}}"
                                });
                                alertPopup.then(function (res) {

                                });

                                BlackWords.loadServerBlackWords();
                                return false;
                            },
                            error: function(blackWord, error) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Info',
                                    template: "{{'Network Error'|translate}}"
                                });
                                alertPopup.then(function (res) {

                                });
                                BlackWords.loadServerBlackWords();
                                return false;
                            }
                        });
                    }
                },
                error: function(error) {
                    //alert("Error: " + error.code + " " + error.message);
                }
            });
        };


        $scope.form = {
            keyword: "",
            page: "1"
        };

        $scope.magnets = [];

        $scope.doSearch = function () {
            console.log($scope.form.keyword);

            if(ParseConfig.myConfig().reviewing!=false){
                if(BlackWords.isInBlackWords($scope.form.keyword)){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: "{{'Contain black words'|translate}}"
                    });
                    alertPopup.then(function (res) {

                    });
                    return false;
                }
            };


            Btspread.search($scope.form.keyword, $scope.form.page).then(function (magnets) {
                //console.log(magnets);
                $scope.magnets = magnets;
            }, function (err) {
                console.log(err);
                if (!angular.isString()) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: "{{'Network Error'|translate}}"
                    });
                    alertPopup.then(function (res) {

                    });
                }
            });
        }
    })

    .controller('MagnetDetailCtrl', function ($scope, $stateParams, $cordovaClipboard, $cordovaToast, $cordovaSocialSharing, $ionicPopup, Btspread, Favourite) {
        console.log($stateParams.hash);
        $scope.hash = $stateParams.hash;

        $scope.loadMagnetDetail = function () {
            Btspread.detail($scope.hash).then(function (magnet) {
                console.log(magnet);
                $scope.magnet = magnet;
            }, function (err) {
                if (!angular.isString()) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: "{{'Network Error'|translate}}"
                    });
                    alertPopup.then(function (res) {

                    });
                }
            });
        };

        $scope.copyMagnetLink = function () {
            $cordovaClipboard
                .copy($scope.magnet.magnetLink)
                .then(function () {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: "{{'Copied'|translate}}"
                    });
                    alertPopup.then(function (res) {
                        console.log('Thank you for not eating my delicious ice cream cone');
                    });
                }, function () {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Info',
                        template: 'Failed to Copy'
                    });
                    alertPopup.then(function (res) {
                        console.log('Thank you for not eating my delicious ice cream cone');
                    });
                });
        };

        $scope.favouriteMagnetLink = function () {
            if (angular.isObject($scope.magnet)) {
                Favourite.add($scope.magnet);
                var alertPopup = $ionicPopup.alert({
                    title: 'Info',
                    template: "{{'Added to Favourite'|translate}}"
                });
                alertPopup.then(function (res) {
                    //console.log('Thank you for not eating my delicious ice cream cone');
                });
            }
        };

        $scope.shareMagnetLink = function () {
            //alert('In development');
            $cordovaSocialSharing
                .share($scope.magnet.magnetLink, $scope.magnet.name) // Share via native share sheet
                .then(function (result) {
                    // Success!
                }, function (err) {
                    // An error occured. Show a message to the user
                });
        };


        $scope.loadMagnetDetail();

    })

    .controller('FavouriteCtrl', function ($scope, Favourite, BlackWords) {
        $scope.magnets = Favourite.getAll();
        BlackWords.loadServerBlackWords();
    })

    .controller('SettingsCtrl', function ($scope, $translate) {

        var preferredLanguage = "zh-CN";
        if (angular.isString(window.localStorage.getItem("NG_TRANSLATE_LANG_KEY"))) {
            preferredLanguage = window.localStorage.getItem("NG_TRANSLATE_LANG_KEY");
        } else {
            if (navigator.language == "zh-CN") {
                preferredLanguage = "zh-CN";
            } else {
                preferredLanguage = "en-US";
            }
        }

        $scope.preferredLanguage = preferredLanguage;
        $scope.setLang = function (lang) {
            $translate.use(lang);
            $scope.preferredLanguage = lang;
        };

        $scope.enableProxy = {checked: false};
        if (window.localStorage.getItem("ENABLE_PROXY") == 1) {
            $scope.enableProxy.checked = true;
        } else {
            $scope.enableProxy.checked = false;
        }

        $scope.enableProxyChange = function () {
            if ($scope.enableProxy.checked == true) {
                window.localStorage.setItem("ENABLE_PROXY", 1);
            } else {
                window.localStorage.setItem("ENABLE_PROXY", 0);
            }
        };

    })

    .controller('AgreementCtrl', function ($scope, $location) {
        $scope.agree = function () {
            window.localStorage.setItem("AGREEMENT", 1);
            $location.path("/tab/search");

        }
    })


;
