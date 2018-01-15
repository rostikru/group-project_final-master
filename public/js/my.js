const app = angular.module('app', ['firebase', 'ngRoute', 'ngDialog']);

app.config(['$locationProvider', function ($locationProvaider) {
    $locationProvaider.hashPrefix('');
    $locationProvaider.html5Mode(true);
}]);

//Створюєм адреси
app.config(function ($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/'
    })
});

//Контроллер
app.controller("defCtrl", function ($scope) {
    function hideSlider() {
        $('.sfafsasf').css({
            display: 'none'
        })
    }

    $scope.navStatus = true;
    $scope.mainpageStatus = true;
    $scope.galery = false;
    $scope.slider = false;
    $scope.contactUsStatus = false;
    $scope.goodsStatus = false;
    $scope.fabricStatus = false;
    hideSlider();

    $scope.chooseGoods = function () {
        $scope.mainpageStatus = false;
        $scope.galery = false;
        $scope.slider = false;
        $scope.contactUsStatus = false;
        $scope.goodsStatus = true;
        $scope.fabricStatus = false;
        hideSlider();
    }
    $scope.chooseHome = function () {
        $scope.mainpageStatus = true;
        $scope.galery = false;
        $scope.slider = false;
        $scope.contactUsStatus = false;
        $scope.goodsStatus = false;
        $scope.fabricStatus = false;
        hideSlider();
    }

    $scope.chooseContacts = function () {
        $scope.mainpageStatus = false;
        $scope.galery = false;
        $scope.slider = false;
        $scope.contactUsStatus = true;
        $scope.goodsStatus = false;
        $scope.fabricStatus = false;
        hideSlider();
    }
    $scope.chooseGalery = function () {
        $scope.mainpageStatus = false;
        $scope.galery = true;
        $scope.slider = true;
        $scope.contactUsStatus = false;
        $scope.goodsStatus = false;
        $scope.fabricStatus = false;
        hideSlider();
    }
    $scope.chooseFabric = function () {
        $scope.mainpageStatus = false;
        $scope.galery = false;
        $scope.slider = false;
        $scope.contactUsStatus = false;
        $scope.goodsStatus = false;
        $scope.fabricStatus = true;
        hideSlider();
    }
});

app.directive("fabricBlock", function () {
    return {
        replace: true,
        templateUrl: "/template/fabric.html",
        controller: function ($scope, $http, ngDialog) {
            $("#b").click(function () {
                var canvas = document.getElementById("c");
                var image = canvas.toDataURL("image/png");

                // Create a hidden link to do the download trick.
                var a = document.createElement("a");
                a.setAttribute("href", image);
                a.setAttribute("download", "canvas.png");
                a.click();

                var post = new XMLHttpRequest();
                // I assume your web server have a handler to handle any POST request send to 
                // '/receive' in the same domain.
                // Create a POST request to /receive
                post.open("POST", "/receive");
                // Send the image data
                post.send(image);
            });

            $scope.email = function () {
                ngDialog.open({
                    template: '/template/forget.html',
                    className: 'ngdialog-theme-default',
                })
            }

            $scope.listofItems = [];
            for (var i = 1; i <= 31; i++) {
                $scope.listofItems.push(i);
            }

            var canvas = new fabric.Canvas('c');

            let moveLeft = 0;
            setTimeout(function () {
                for (var i = 1; i <= $scope.listofItems.length; i++) {
                    $('#res' + i).bind('click', function () {
                        var imgInstance = new fabric.Image(this, {
                            left: 100 + (moveLeft += 10),
                            top: 100 + (moveLeft += 10),
                        });
                        canvas.add(imgInstance);
                    });
                }
            })


        }
    }
});




/*        forget block for fabric               */

app.directive('forgetBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/forget-block.html',
        controller: function ($scope, $http, ngDialog) {

            //Кидаєм на сервер пошту для відправки забутого паролю
            $scope.SendPDFToEmail = function () {
                var canvas = document.getElementById("c");
                var image = canvas.toDataURL("image/png");

                var post = new XMLHttpRequest();
                // I assume your web server have a handler to handle any POST request send to 
                // '/receive' in the same domain.
                // Create a POST request to /receive
                post.open("POST", "/receive");
                // Send the image data
                post.send(image);

                let obj = {
                    mail: $scope.remindMail,
                    image: "canvas.png"
                };

                $http.post('http://localhost:8000/send', obj).then(function successCallback(response) {
                    console.log(response.data);
                }, function errorCallback(response) {
                    console.log("Error!!! " + response.data);
                });

                ngDialog.closeAll();
            }
        }
    }
});

/*      (end)  forget block for fabric               */


app.directive("navBlock", function () {
    return {
        replace: true,
        templateUrl: "/template/navBlock.html",
        controller: function ($scope) {}
    }
});

app.directive("goodsBlock", function () {
    return {
        replace: 'true',
        templateUrl: 'template/goods.html',
        controller: function ($scope) {
            $scope.listOfGoods = [];

            document.getElementsByTagName("BODY")[0].onresize = function () {
                SetGoodsPosition(300);
                SetBlockToCenterByAnimat(500);
            };

            $("#goodsDirectory").click(function () {
                SetGoodsPosition(300);
                SetBlockToCenterByAnimat(500);
            });

            function SetGoodsPosition(ms) {
                setTimeout(function () {
                    let x = 0,
                        y = 0,
                        jj = 0,
                        goodblockWidth = 200,
                        goodBlock = 20;

                    let isSecondRow = false;
                    let arr = [];
                    let blockWidth = 0;

                    for (var j = 0; j < $(".good__block").length; j++) {
                        if (x > $(".main___good__block").width() - goodblockWidth) {
                            x = 0;
                            isSecondRow = true;
                        }

                        arr.push({
                            left: 0,
                            top: 0,
                            height: 0
                        });

                        if (isSecondRow) {
                            y = arr[jj].height + goodBlock + arr[jj].top;
                            jj++;
                        }

                        arr[j].left = x;
                        arr[j].top = y;
                        arr[j].height = $(".good__block").eq(j).height();

                        x += (goodblockWidth + goodBlock);

                        if (!isSecondRow) {
                            blockWidth += (goodblockWidth + goodBlock);
                        }
                    }

                    for (var ii = 0; ii < arr.length; ii++) {
                        $(".good__block").eq(ii).animate({
                            left: arr[ii].left + "px",
                            top: arr[ii].top + "px",
                            opacity: "1"
                        }, 700);

                        $("#goodsBlockElement").css({
                            height: (arr[ii].top + 300) + "px",
                        });

                        $(".main___good____content").css({
                            height: (arr[ii].top + 300) + "px",
                            width: (blockWidth - 20) + "px",
                        });
                    }

                }, ms)
            };

            function SetBlockToCenterByAnimat(ms) {
                setTimeout(() => {
                    let leftMargin = ($(".main___good__block").width() - $(".main___good____content").width()) / 2;
                    $(".main___good____content").animate({
                        left: leftMargin + "px"
                    });
                }, ms);
            }


        }
    }
});

app.directive("chatBlock", function () {
    return {
        replace: 'true',
        templateUrl: 'template/chat.html',
        controller: function ($scope, $firebaseArray) {

            var ref = firebase.database().ref().child('messages');
            $scope.messages = $firebaseArray(ref);

            $scope.SendMessageToFirebaseServer = function () {
                if ($scope.messageText !== undefined && $scope.chatUserNameInput !== undefined) {
                    $scope.messages.$add({
                        name: $scope.chatUserNameInput,
                        message: $scope.messageText,
                        date: Date.now()
                    })
                    $scope.messageText = "";
                } else {
                    alert("Type required fields");
                }
            }

            let isChatClosed = true;
            $scope.OpenCloseChatBtn = function () {
                if (isChatClosed) {
                    $("#firebaseChatBlock").animate({
                        right: "10px"
                    });
                    $("#open__close_chat_btn").val("Hide chat");
                    isChatClosed = false;
                } else {
                    $("#firebaseChatBlock").animate({
                        right: "-599px"
                    });
                    $("#open__close_chat_btn").val("Open chat");
                    isChatClosed = true;
                }
            }
        }
    }
});

app.directive("contactusBlock", function () {
    return {
        replace: true,
        templateUrl: "/template/contactUs.html",
        controller: function ($scope, $http) {
            $scope.SendMessage = function () {
                var sendMesObj = {
                    name: (document.getElementById("contactInputName")).value,
                    email: (document.getElementById("contactInputEmail")).value,
                    phone: (document.getElementById("contactInputPhone")).value,
                    message: (document.getElementById("contactInputMessage")).value
                }

                $http.post("http://localhost:8000/sendMessage", sendMesObj).then(function success(res) {
                    console.log(res.data);
                    alert("Message sended");

                    (document.getElementById("contactInputName")).value = "";
                    (document.getElementById("contactInputEmail")).value = "";
                    (document.getElementById("contactInputPhone")).value = "";
                    (document.getElementById("contactInputMessage")).value = "";
                }, function error() {
                    console.log("Error");
                });

            }
        }
    }
});



app.directive('sliderBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/slider.html',
        controller: function ($scope) {
            
            $(document).ready(function () {
            var ScreenWidth;

            function height() {
                ScreenWidth = window.innerWidth;
            }

            // get x anf y ofset of div
            $('#pager').mousemove(function (e) {
                var X = e.pageX;
                var Y = e.pageY;
                var halfOfset = ScreenWidth / 2;
                var ofsetBox = halfOfset - X;
                var elem = $("#pager");
                var maxOfset = elem[0].scrollWidth;
                $("#pager").scrollLeft(-2 * ofsetBox); // change this multiple to fit your max scroll,depends on no of images.
                // also control the speed of the move.
            });

            window.addEventListener('load', height);
            window.addEventListener('resize', height);

                $('.cycle-slideshow').cycle('reinit');
                for (var i = 1; i <= 24; i++) {
                    $(document).ready(function () {
                        $('.cycle-slideshow').eq(i).cycle('add', '<img src="../img/Galery/' + i + '.jpg">');
                    });
                }
                $('.cycle-slideshow').cycle('reinit');
            });

        }
    }
});

app.directive('galeryBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/galery.html',
        controller: function ($scope) {

            $('.item_masonry').hover(function () {
                $(this).find('.cover-item-galery').fadeIn();
            }, function () {
                $(this).find('.cover-item-galery').fadeOut();
            });

            $scope.click1 = function () {
                $('.sfafsasf').css({
                    display: 'block'
                })

                $scope.galery = false;
                $scope.slider = true;
            };


        }
    }
});


//Директива mainpageBlock'
app.directive('mainpageBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/mainpage.html',
        controller: function ($scope) {}
    }
});
