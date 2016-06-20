angular.module('starter.services', [])

    .factory('Btspread', function ($http, $q, $ionicLoading) {
        var request = function (req) {
            $ionicLoading.show({
                template: '<ion-spinner icon="ios-small"></ion-spinner>'
            });
            var deferred = $q.defer();

            if (window.localStorage.getItem("ENABLE_PROXY") == 1) {
                var proxyUrl = "http://114.55.65.40/test10/bridge.php?url=";
                req.url = proxyUrl + req.url;
            }

            $http(req).success(function (data, status, headers, config) {
                $ionicLoading.hide();
                deferred.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                $ionicLoading.hide();
                deferred.reject(data, status, headers, config);
            });

            return deferred.promise;
        };

        var search = function (keyword, page) {
            var deferred = $q.defer();
            var url = "https://btso.pw/search/" + encodeURI(keyword) + "/currentPage/" + page;
            var req = {
                method: 'GET',
                url: url,
                timeout: 10000
            };

            request(req).then(function (data, status, headers, config) {
                var jQuery = cheerio.load(data);
                var magnets = [];
                var list = jQuery('.data-list a');
                for (var i = 0; i < list.length; i++) {
                    var item = jQuery(list[i]);
                    var hash = getHashFromUrl(item.attr('href'));
                    var magnet = {
                        name: item.attr('title'),
                        hash: hash,
                        url: item.attr('href'),
                        sizeDate: item.find('.size-date').text()
                    };
                    magnets.push(magnet);
                }
                //console.log(magnets);
                deferred.resolve(magnets);
            }, function (msg) {
                deferred.reject(msg);
            });

            return deferred.promise;
        };

        var detail = function (hash) {
            var deferred = $q.defer();
            var url = "https://btso.pw/magnet/detail/hash/" + hash;
            var req = {
                method: 'GET',
                url: url,
                timeout: 10000
            };

            request(req).then(function (data, status, headers, config) {
                var jQuery = cheerio.load(data);
                var magnet = {};
                magnet.name = jQuery('.container h3').eq(0).text();
                magnet.hash = hash;
                magnet.url = url;
                magnet.magnetLink = jQuery('#magnetLink').val();
                magnet.summary = jQuery('.detail').eq(0).find('.row').text();
                magnet.fileNumber = jQuery('.detail').eq(0).find('.row').eq(1).find('.value').text();
                magnet.contentSize = jQuery('.detail').eq(0).find('.row').eq(2).find('.value').text();
                magnet.convertDate = jQuery('.detail').eq(0).find('.row').eq(3).find('.value').text();
                magnet.keywords = jQuery('.detail').eq(0).find('.row').eq(4).find('.value').text();
                magnet.fileList = [];
                var list = jQuery('.detail').eq(1).find('.row');//$('.detail:eq(1)').find('.row')
                for (var i = 1; i < list.length; i++) {//skip list header
                    var item = jQuery(list[i]);
                    var file = {};
                    file.name = item.find('.file').text();
                    file.size = item.find('.size').text();
                    magnet.fileList.push(file);
                }

                deferred.resolve(magnet);
            }, function (msg) {
                deferred.reject(msg);
            });

            return deferred.promise;
        };

        var getHashFromUrl = function (url) {
            var x = url.split("/");
            return x[x.length - 1];
        };


        return {
            request: request,
            search: search,
            detail: detail,
            getHashFromUrl: getHashFromUrl
        };

        /*return {
         search:function(keyword,page){
         var self = this;
         var deferred = $q.defer();
         var url = "https://btso.pw/search/"+keyword+"/currentPage/"+page;
         $http.get(url)
         .success(function(response) {
         //console.log(response);
         var jQuery = cheerio.load(response);
         var magnets = [];
         var list = jQuery('.data-list a');
         for(var i=0;i<list.length;i++){
         var item = jQuery(list[i]);
         var hash = self.getHashFromUrl(item.attr('href'));
         var magnet = {
         name:item.attr('title'),
         hash:hash,
         url:item.attr('href'),
         sizeDate:item.find('.size-date').text()
         };
         magnets.push(magnet);
         }
         //console.log(magnets);
         deferred.resolve(magnets);
         })
         .error(function () {
         deferred.reject('network');
         });

         return deferred.promise;
         },
         detail:function(hash){
         var self = this;
         var deferred = $q.defer();
         var url = "https://btso.pw/magnet/detail/hash/"+hash;
         $http.get(url)
         .success(function(response) {
         //console.log(response);
         var jQuery = cheerio.load(response);
         var magnet = {};
         magnet.name = jQuery('.container h3').text();
         magnet.hash = hash;
         magnet.url = url;
         magnet.magnetLink = jQuery('#magnetLink').val();
         magnet.summary = jQuery('.detail').eq(0).find('.row').text();
         magnet.fileList = jQuery('.detail').eq(1).find('.row').text();
         deferred.resolve(magnet);
         })
         .error(function () {
         deferred.reject('network');
         });

         return deferred.promise;
         },
         getHashFromUrl:function(url){
         var x = url.split("/");
         return x[x.length-1];
         }

         }*/
    })

    .factory('Favourite', function () {
        var initial = function () {
            if (window.localStorage.getItem("fav") == null) {
                var fav = [];
                window.localStorage.setItem("fav", JSON.stringify(fav));
            }
            return true;
        };

        var getAll = function () {
            initial();
            return JSON.parse(window.localStorage.getItem("fav"));
        };

        var add = function (obj) {
            initial();
            console.log(obj);
            var list = getAll();
            list.push(obj);
            window.localStorage.setItem("fav", JSON.stringify(list));
            console.log(list);
            return true;
        };

        var remove = function (index) {
            initial();
            var list = getAll();
            var tmp = [];
            for (var i = 0; i < list.length; i++) {
                if (i == index) {
                    continue;
                } else {
                    tmp.push(list[i]);
                }
            }
            window.localStorage.setItem("fav", JSON.stringify(tmp));
            return true;
        };

        return {
            initial: initial,
            getAll: getAll,
            add: add,
            remove: remove
        };
    })

    .factory('BlackWords', function (){
        var BlackWord = Parse.Object.extend("BlackWord");
        var query = new Parse.Query(BlackWord);

        var loadServerBlackWords = function(){
            var wordList = [];
            query.find({
                success: function(results) {
                    console.log("Successfully retrieved " + results.length + " records");
                    // Do something with the returned Parse.Object values
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];
                        wordList.push(object.get('word'));
                        console.log(object.id + ' - ' + object.get('word'));
                    }

                    localStorage.setItem("BLACKWORDS",JSON.stringify(wordList));
                    Parse.Config.get().then(function(config) {
                        localStorage.setItem("BLACKWORDS_UPDATE",config.get("blackWordsDate"));
                        //console.log(config.get("blackWordsDate"));
                    }, function(error) {
                        // Something went wrong (e.g. request timed out)
                    });
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        };

        var loadLocalStorageBlackWords = function(){
            var tmp =  localStorage.getItem("BLACKWORDS");
            if(tmp!=null){
                return JSON.parse(tmp);
            }else{
                return false;
            }
        };

        var isInBlackWords= function(word){
            var wordsList  = loadLocalStorageBlackWords();
            var is =false;
            for (var i=0;i<wordsList.length;i++){
                if(word.search(wordsList[i])>=0){
                    is = true;
                    break;
                }
            }
            return is;
        };

        return {
            loadServerBlackWords:loadServerBlackWords,
            loadLocalStorageBlackWords:loadLocalStorageBlackWords,
            isInBlackWords:isInBlackWords
        }
    })

    .factory('ParseConfig', function ($q){
        var myConfig = function(){
            var t = window.localStorage.getItem("CONFIG");
            if(t!=null){
                return JSON.parse(t);
            }else{
                return {blackWordsDate: "2016-06-28T08:51:00.000Z", reviewing: true, version: "0.0.1"};
            }
        };

        var loadParseConfig = function () {
            var deferred = $q.defer();
            Parse.Config.get().then(function(config) {
                window.localStorage.setItem("CONFIG",JSON.stringify(config.attributes));
                deferred.resolve(config);
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        return {
            myConfig:myConfig,
            loadParseConfig:loadParseConfig
        }
    })
;

