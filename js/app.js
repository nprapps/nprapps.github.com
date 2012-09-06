$(document).ready(function() {

	// LOAD SCHEDULE DATA
	var scheduleData = new Miso.Dataset({
		url : function() {
			return "data/schedule.csv?t=" + (new Date()).getTime();
		},
		delimiter : ",",
		columns : [
			{ name : 'photo', type : 'string' },
			{ name : 'archive', type : 'string' }
		],
		interval : 60000,
		resetOnFetch : true
	});
	scheduleData.fetch({
		success: function() {
			var schedule = '<h2>Democratic Convention Schedule Highlights<\/h2><ul>';
			var currentSubhed = '';
			for (var i = 0; i < scheduleData.length; i++) {
				if (scheduleData.column('time').data[i] != currentSubhed) {
					if (currentSubhed != '') {
						schedule += '<\/ul>';
					}
					schedule += '<li><h3 class="slug">' + scheduleData.column('time').data[i] + '<\/h3><ul>';
					currentSubhed = scheduleData.column('time').data[i];
				}
				if (scheduleData.column('photo').data[i]) {
					schedule += '<li class="img">';
				} else {
					schedule += '<li>';
				}
				if (scheduleData.column('archive').data[i]) {
					schedule += '<a href="' + scheduleData.column('archive').data[i] + '">';
				}
				if (scheduleData.column('photo').data[i]) {
					schedule += '<img src="' + scheduleData.column('photo').data[i] + '" alt="Photo" />';
				}
				if (scheduleData.column('archive').data[i]) {
					schedule += '<\/a>';
				}
				schedule += '<h4>';
				if (scheduleData.column('archive').data[i]) {
					schedule += '<a href="' + scheduleData.column('archive').data[i] + '">';
				}
				schedule += scheduleData.column('speaker').data[i];
				schedule += '<\/h4>';
				if (scheduleData.column('archive').data[i]) {
					schedule += '<\/a>';
				}
				if (scheduleData.column('speaker_bio').data[i]) {
					schedule += '<p>' + scheduleData.column('speaker_bio').data[i] + '<\/p>';
				}
				if (scheduleData.column('archive').data[i]) {
					schedule += '<p class="archive"><a href="' + scheduleData.column('archive').data[i] + '">Speech Audio And Transcript</a></p>';
				}
			}
			schedule += '<\/ul>';
			$('#speakerList').empty().append(schedule);
		}
	});


	// LOAD ATTRIBUTION DATA
	var _status = '';
	var attributionData = new Miso.Dataset({
		url : function() {
			return "data/attribution.csv?t=" + (new Date()).getTime();
		},
		delimiter : ",",
		interval : 60000,
		resetOnFetch : true
	});
	attributionData.fetch({
		success: function() {
			var a = attributionData;

			// coming soon
			var attrIsLive = a.rows(function(row) { return row.slug == 'is-live'; });
			var attrComingMessage = a.rows(function(row) { return row.slug == 'coming-message'; });
			$('#attrComingSoon').empty().append(attrComingMessage.column('desc').data[0]);

			var isLive = attrIsLive.column('desc').data[0];
			if (isLive == 'FALSE' && _status != 'FALSE') {
				$('body').addClass('comingSoon');
				if (!navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/)) {
					jwplayer().stop();
				}
				$('#comingsoon').show();
				$('#comingsoon').css("visibility", "visible");
				$('#playercon').hide();
				$('#attrComingSoon').empty().append(attrComingMessage.column('desc').data[0]);
				$('#chat').append($('#speakerList'));
				_status = 'FALSE';
			} else if (isLive == 'TRUE' && _status != 'TRUE') {
				$('body').removeClass('comingSoon');
				$('#comingsoon').hide();
				$('#playercon').show();
				$('#playercon').css("visibility", "visible");
				$('#sidebar').append($('#speakerList'));
				_status = 'TRUE';
			}

			// on stage
			var attrStageIntro = a.rows(function(row) { return row.slug == 'on-stage-intro'; });
			var attrStageName = a.rows(function(row) { return row.slug == 'on-stage-name'; });
			var attrStageBio = a.rows(function(row) { return row.slug == 'on-stage-bio'; });
			$('#attrOnStageIntro').empty().append(attrStageIntro.column('desc').data[0]);
			$('#attrOnStageName').empty().append(attrStageName.column('desc').data[0]);
			$('#attrOnStageBio').empty().append(attrStageBio.column('desc').data[0]);

			// chat header
			var attrChat = a.rows(function(row) { return row.slug == 'chat-personalities'; });
			$('#attrChatPeople').empty().append(attrChat.column('desc').data[0]);

			// background image
			var attrImg = a.rows(function(row) { return row.slug == 'header-photo'; });
			$('#header').find('.span12').css('background-image', 'url(' + attrImg.column('desc').data[0] + ')');
			
			// NPR election coverage promo
			var attrElexDesc = a.rows(function(row) { return row.slug == 'election-blurb'; });
			$('#attrElexDesc').empty().append(attrElexDesc.column('desc').data[0]);
			
			// credits
			var attrCredit = a.rows(function(row) { return row.slug == 'credits'; });
			$('#attrCredit').empty().append('Credits: ' + attrCredit.column('desc').data[0]);

		}
	});


	// LIVE UPDATES SLIDER
	var s = $('#liveUpdates');
	var sb = s.find('.updateWrapper');
	var b = s.find('.updateBack');
	var n = s.find('.updateNext');
	var sbItemWidth = 138;
	var max = parseInt(sb.css('left')) + 1;

	// load data
	var coverageData = new Miso.Dataset({
		url : function() {
			return "data/coverage.csv?t=" + (new Date()).getTime();
		},
		columns : [
			{ name : 'link', type : 'string' }
		],
		delimiter : ",",
		interval : 60000,
		resetOnFetch : true
	});
	coverageData.fetch({
		success: function() {
			sb.empty();
			for (var i = 0; i < coverageData.length; i++) {
				var item = '<div class="update">';
				item += '<h3 class="slug timeago" title="' + coverageData.column('timestamp').data[i] + '"></h3>';
				item += '<p>';
				if (coverageData.column('link').data[i]) {
					item += '<a href="' + coverageData.column('link').data[i] + '" target="_blank">';
				}
				item += '<strong>' + coverageData.column('headline').data[i] + ':</strong> ';
				item += coverageData.column('text').data[i];
				if (coverageData.column('link').data[i]) {
					item += ' | <strong>more &raquo;<\/strong><\/a>';
				}
				item += '<\/p><\/div>';
				sb.prepend(item);
			}
			if ($(window).width() <= 480) {
				sb.width('100%');
			} else {
				sbItemWidth = sb.find('.update:eq(1)').outerWidth() + parseInt(sb.find('.update:eq(1)').css('margin-left'));
				sb.width(sbItemWidth * sb.find('.update').length);
			}

			jQuery("h3.timeago").timeago();
		}
	});

	// next button
	n.click(function() {
		var min = -(sb.width() - s.width() + max);
		var inc = sbItemWidth * 2;
		var l = parseInt(sb.css('left'));
		if ( l > min && (l - inc) > min ) {
			sb.animate({ left: '-=' + inc }, 'fast');
		} else {
			sb.animate({ left: min }, 'fast');
		}
		return false;
	});

	// back button
	b.click(function() {
		var min = -(sb.width() - s.width() + max);
		var inc = sbItemWidth * 2;
		var l = parseInt(sb.css('left'));
		if ( (l < max) && ((l + inc) < max) ) {
			sb.animate({ left: '+=' + inc }, 'fast');
		} else {
			sb.animate({ left: max }, 'fast');
		}
		return false;
	});

	window.onresize = function() {
		if ($(window).width() <= 480) {
			sb.width('100%');
			sb.css('left', '0');
		} else {
			sb.width(sbItemWidth * sb.find('.update').length);
			sb.css('left', max);
		}
	}

	jQuery("h3.timeago").timeago();

    $("#donate").click(function(event){
        event.preventDefault();
        console.log("click");
        navigator.geolocation.getCurrentPosition(
            function(position) {
                geoStation(position.coords.latitude,position.coords.longitude, function(stations){
                    showDonate(stations);
                });
            },
            function(err) {
                window.location.href = $("#donate")[0].href;
            }
        );
    });
    
    function showDonate(stations) {
        console.log(stations);
        var template = $("#stations").html();
		$("#donatepop").append(_.template(template,{stations:stations}));
    }
    
    function geoStation(lat,lon,callback) {
        $.getJSON('http://api.npr.org/stations?lat=' + lat + '&lon=' + lon + '&apiKey=MDAzNDk2MDIzMDEyOTc4NzIxNDMyMjZkMA001&format=json&callback=?', function(data){            
            var stations = [];
            _.each(data.station,function(station){
               // console.log(station.callLetters);
               if (station.url) { 
                   var donateUrl;
                   station.url.every(function(stream){
                       if(stream.typeId == "4"){
                           donateUrl = stream["$text"];
                           return false;
                       }
                       return true;
                   });
                   stations.push({
                      'donateUrl': donateUrl,
                      'callLetters': station.callLetters["$text"],
                      'frequency': station.frequency["$text"]
                   });
               }
            });
            callback(stations);
        }).error(function() {
            window.location.href = $("#donate")[0].href;
		});
    }
    
});