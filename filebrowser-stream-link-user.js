// ==UserScript==
// @name         Filebrowser Stream Link
// @copyright    2019+, Zoidy (MIT Licensed)
// @namespace    https://github.com/zoidy/
// @homepageURL  https://github.com/zoidy/filebrowser-streamlink/
// @updateURL    https://github.com/zoidy/filebrowser-streamlink/raw/master/filebrowser-stream-link-user.js
// @downloadURL  https://github.com/zoidy/filebrowser-streamlink/raw/master/filebrowser-stream-link-user.js
// @version      0.1
// @description  Add a button to filebrowser (https://github.com/filebrowser/filebrowser) to more easily generate a network streaming link for playing in an external player
// @author       Zoidy
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    waitForElementToDisplay("#dropdown",500);

    function waitForElementToDisplay(selector, time) {
        if(document.querySelector(selector)!=null) {
            addButton();
            return;
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(selector, time);
            }, time);
        }
    }

    function addButton(){
        //add the play button to the toolbar
        var elem=document.getElementById("dropdown");
        var btnvlc;

        if(!elem) return;

        elem=elem.firstElementChild;
        if(elem && elem.nodeName.toLowerCase()==="div"){
            var btnbar_share=elem;
            btnbar_share.insertAdjacentHTML("afterbegin", '<button aria-label="Stream" title="Stream" class="action" style="" id="btnvlc"><i class="material-icons">play_circle_outline</i><span>Stream</span></button>');
            btnvlc=document.getElementById("btnvlc");
            btnvlc.onclick=getShare;
        }
    }

    function getShare(){
        var filename=getSelectedFile();
        if(!filename) return;

        var apilink=getAPILink(filename);
        if(!apilink) return;

        newSharedLink(apilink,filename);
    }

    function getSelectedFile(){
        //***get the item selected in the UI

        //get the selected row item. If there are multiple selected, pick the first one
        var selecteditems=document.querySelectorAll("div.item[aria-selected='true'");
        if(selecteditems.length>0){
            var item=selecteditems[0];
            var filename=encodeURI(item.getAttribute("aria-label"));
            if(item.firstElementChild.firstElementChild.innerText === "volume_up" ||
               item.firstElementChild.firstElementChild.innerText === "movie")
                return filename;
            else
                alert("Please select a sound or video file");
        }else
            alert("Please select an item");
        return null;
    }

    function getAPILink(filename){
        //***build the API request path

      	//base url where files are served from (no domain)
      	var homepath=document.querySelectorAll(".router-link-active[aria-label='Home']")[0].getAttribute("href");

      	var homeurl=window.location.origin+homepath.replace("/files/","");

        var apipath=homeurl+"/api/share/"+window.location.pathname.replace(homepath,"")+filename;
        return apipath;
    }

    function newSharedLink(apilink,filename){
        //***generate a new shared link using the API and output the direct link in a prompt

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange=function(){
            if (this.readyState != 4) return;

            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                var homepath=document.querySelectorAll(".router-link-active[aria-label='Home']")[0].getAttribute("href");
              	var homeurl=window.location.origin+homepath.replace("/files/","");

                var streamurl=homeurl+"/api/public/dl/"+data.hash+"/"+filename;
                downloadM3U(filename,streamurl);
                prompt("Stream URL",streamurl);
            }else
                alert("error creating shared link. Status " + this.status);
        }

        xhr.open("POST", apilink+"?expires=24&unit=hours", true);
        xhr.setRequestHeader('X-Auth', localStorage.jwt);
        xhr.send();
    }

    function downloadM3U(filename,link) {
        //https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server

        var m3utext="#EXTM3U\n"+link

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(m3utext));
        element.setAttribute('download', decodeURIComponent(filename)+".m3u8");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

})();
