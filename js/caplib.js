/**
 * @license
 * Copyright (c) 2013, Carnegie Mellon University
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this
 * list of conditions and the following disclaimer in the documentation and/or
 * other materials provided with the distribution.
 *
 * Neither the name of the Carnegie Mellon University nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * caplib.js -- Common Alerting Protocol 1.2 helper library
 * version 1.1.2 - 12 June 2014
 *
 * Copyright (c) 2013, Carnegie Mellon University
 * All rights reserved.
 *
 * See LICENSE.txt for license terms (Modified BSD)
 *
 * API (see trivial usage example at end of file):
 *  new Alert() - returns an uninitialized Alert object
 *  parseCAP2Alert() - turn a CAP XML string into an Alert object
 *  Alert.getJSON() - returns the Alert (including included Infos, Resources and Elements) as a JSON string
 *  Alert.getCAP() - returns the Alert as CAP 1.2 XML
 *  Alert.addInfo() - adds an Info object to the Alert.infos array and returns the new Info object
 *  Info.addCategory(string) - adds a category value string to the Info.categories array (values are constrained in spec)
 *  Info.addResponseType(string) - adds a responseType value string to the Info.responseTypes array (values are constrained in spec)
 *  Info.addEventCode(string, string) - adds an eventCode valueName/value pair to the Info.eventCodes array (values may be constrained in 'valueName' namespace)
 *  Info.addParameter(string, string) - adds a parameter valueName/value pair to the Info.parameters array (values may be constrained in 'valueName' namespace)
 *  Alert.addArea(string) - adds an Area object to the Info.areas array, initializes the areaDesc field from argument and returns the new Area object
 *  Alert.addResource(string) - adds a Resource object to the Info.resources array, initializes the resourceDesk field from argument and returns the new Resource object
 *  All other properties are populated by direct assignment.  All reads are performed by direct reference.
 */

//////////////////////////////////////////////////
// ALERT Object
var Alert = function() {
  this.identifier = '';  // REQUIRED
  this.sender = '';  // REQUIRED
  this.sent = '';  // REQUIRED
  this.status = 'Actual';  // REQUIRED: values Actual, Exercise, System, Test, Draft
  this.msgType = 'Alert';  // REQUIRED: values Alert, Update, Cancel, Ack, Error
  this.scope = 'Public';  // REQUIRED: values Public, Restricted, Private
  this.source = '';
  this.restriction;
  this.addresses;
  this.code;
  this.note = '';
  this.references = '';
  this.incidents;
  this.infos = [];
};

Alert.prototype.addInfo = function() {
  newInfo = new Info();
  this.infos.push(newInfo);
  return newInfo;
};

Alert.prototype.getJSON = function() {
  return JSON.stringify(this, undefined, 2);
};

Alert.prototype.getCAP = function() {
  var xml = '<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">\n';
  var indent = '  ';
  xml = xml + indent + '<identifier>' + this.identifier + '</identifier>\n';
  xml = xml + indent + '<sender>' + this.sender + '</sender>\n';
  xml = xml + indent + '<sent>' + this.sent + '</sent>\n';
  xml = xml + indent + '<status>' + this.status + '</status>\n';
  xml = xml + indent + '<msgType>' + this.msgType + '</msgType>\n';
  if (this.source && this.source != '') {
    xml = xml + indent + '<source>' + this.source + '</source>\n';
  }
  xml = xml + indent + '<scope>' + this.scope + '</scope>\n';
  if (this.restriction && this.restriction != '') {
    xml = xml + indent + '<restriction>' + this.restriction +
          '</restriction>\n';
  }
  if (this.address && this.addresses != '') {
    xml = xml + indent + '<addresses>' + this.addresses + '</addresses>\n';
  }
  if (this.code && this.code != '') {
    xml = xml + indent + '<code>' + this.code + '</code>\n';
  }
  if (this.note && this.note != '') {
    xml = xml + indent + '<note>' + this.note + '</note>\n';
  }
  if (this.references && this.references != '') {
    xml = xml + indent + '<references>' + this.references + '</references>\n';
  }
  if (this.incidents && this.incidents != '') {
    xml = xml + indent + '<incidents>' + this.incidents + '</incidents>\n';
  }
  if (this.infos && this.infos.length > 0) {
    for (var i = 0; i < this.infos.length; i++) {
      var info = this.infos[i];
      xml = xml + indent + '<info>\n';
      indent = '    ';
      xml = xml + indent + '<language>' + info.language + '</language>\n';
      if (info.categories.length) {
        for (var i = 0; i < info.categories.length; i++) {
          var category = info.categories[i];
          xml = xml + indent + '<category>' + category + '</category>\n';
        }
      }
      xml = xml + indent + '<event>' + info.event + '</event>\n';
      if (info.responseTypes && info.responseTypes.length) {
        for (var i = 0; i < info.responseTypes.length; i++) {
          var responseType = info.responseTypes[i];
          xml = xml + indent + '<responseType>' + responseType +
                '</responseType>\n';
        }
      }
      xml = xml + indent + '<urgency>' + info.urgency + '</urgency>\n';
      xml = xml + indent + '<severity>' + info.severity + '</severity>\n';
      xml = xml + indent + '<certainty>' + info.certainty + '</certainty>\n';
      if (this.audience && this.audience != '') {
        xml = xml + indent + '<audience>' + info.audience + '</audience>\n';
      }

      if (info.eventCodes && info.eventCodes.length) {
        for (var i = 0; i < info.eventCodes.length; i++) {
          var eventCode = info.eventCodes[i];
          xml = xml + indent + '<eventCode>' + eventCode + '</eventCode>\n';
        }
      }
      if (info.effective && info.effective != '') {
        xml = xml + indent + '<effective>' + info.effective + '</effective>\n';
      }
      if (info.onset && info.onset != '') {
        xml = xml + indent + '<onset>' + info.onset + '</onset>\n';
      }
      if (info.expires && info.expires != '') {
        xml = xml + indent + '<expires>' + info.expires + '</expires>\n';
      }
      if (info.senderName && info.senderName != '') {
        xml = xml + indent + '<senderName>' + info.senderName +
              '</senderName>\n';
      }
      if (info.headline && info.headline != '') {
        xml = xml + indent + '<headline>' + info.headline + '</headline>\n';
      }
      if (info.description && info.description != '') {
        xml = xml + indent + '<description>' + info.description +
              '</description>\n';
      }
      if (info.instruction && info.instruction != '') {
        xml = xml + indent + '<instruction>' + info.instruction +
              '</instruction>\n';
      }
      if (info.web && info.web != '') {
        xml = xml + indent + '<web>' + info.web + '</web>\n';
      }
      if (info.contact && info.contact != '') {
        xml = xml + indent + '<contact>' + info.contact + '</contact>\n';
      }
      if (info.parameters && info.parameters.length) {
        for (var i = 0; i < info.parameters.length; i++) {
          var parameter = info.parameters[i];
          xml = xml + indent + '<parameter>\n';
          xml = xml + indent + '  <valueName>' + parameter[0] + '</valueName>\n';
          xml = xml + indent + '  <value>' + parameter[1] + '</value>\n';
          xml = xml + indent + '</parameter>\n';
        }
      }
      if (info.resources && info.resources.length > 0) {
        for (var i = 0; i < this.info.resources.length; i++) {
          var resource = info.resources[i];
          xml = xml + indent + '<resource>\n';
          indent = '      ';
          xml = xml + indent + '<resourceDesc>' + resource.resourceDesc +
                '</resourceDesc>\n';
          if (resource.mimeType && resource.mimeType != '') {
            xml = xml + indent + '<mimeType>' + resource.mimeType +
                  '</mimeType>\n';
          }
          if (resource.uri && resource.uri != '') {
            xml = xml + indent + '<uri>' + resource.uri + '</uri>\n';
          }
          if (resource.digest && resource.digest != '') {
            xml = xml + indent + '<digest>' + resource.digest + '</digest>\n';
          }
          indent = '  ';
          xml = xml + indent + '</resource>\n';
        }
      }
      if (info.areas && info.areas.length > 0) {
        for (var i = 0; i < info.areas.length; i++) {
          var area = info.areas[i];
          xml = xml + indent + '<area>\n';
          indent = '      ';
          if (area.areaDesc == '') {
            area.areaDesc = 'Unspecified Area';
          }
          xml = xml + indent + '<areaDesc>' + area.areaDesc + '</areaDesc>\n';
          if (area.polygons && area.polygons.length) {
            for (var i = 0; i < area.polygons.length; i++) {
              xml = xml + indent + '<polygon>' + area.polygons[i] +
                    '</polygon>\n';
            }
          }
          if (area.circles && area.circles.length) {
            for (var i = 0; i < area.circles.length; i++) {
              xml = xml + indent + '<circle>' + area.circles[i] + '</circle>\n';
            }
          }
          if (area.geocodes && area.geocodes.length) {
            for (var i = 0; i < area.geocodes.length; i++) {
              var geocode = area.geocodes[i];
              xml = xml + indent + '<geocode>\n';
              xml = xml + indent + '  <valueName>' + geocode[0] +
                    '</valueName>\n';
              xml = xml + indent + '  <value>' + geocode[1] + '</value>\n';
              xml = xml + indent + '</geocode>\n';
            }
          }
          if (area.altitude && area.altitude != '') {
            xml = xml + indent + '<altitude>' + area.altitude + '</altitude>\n';
          }
          if (area.ceiling && area.ceiling != '') {
            xml = xml + indent + '<ceiling>' + area.ceiling + '</ceiling>\n';
          }
          indent = '    ';
          xml = xml + indent + '</area>\n';
        }
      }
      indent = '  ';
      xml = xml + indent + '</info>\n';
    }
  }
  xml = xml + '</alert>';
  return xml;
};


/////////////////////////////////////////////
// INFO Object
var Info = function() {
  this.language = '';
  // Values: Geo, Met, Safety, Security, Rescue, Fire, Health, Env, Transport,
  // Infra, CBRNE, Other.
  this.categories = [];  // REQUIRED
  this.event = '';  // REQUIRED
  this.responseTypes = [];
  // Values: Immediate, Expected, Future, Past, Unknown.
  this.urgency = '';  // REQUIRED
  // Values: Extreme, Severe, Moderate, Minor, Unknown.
  this.severity = '';  // REQUIRED
  // Values: Observed, Likely, Possible, Unlikely, Unknown.
  this.certainty = '';  // REQUIRED
  this.audience = '';
  this.eventCodes = [];
  this.effective = '';
  this.onset = '';
  this.expires = '';
  this.senderName = '';
  this.headline = '';
  this.description = '';
  this.instruction = '';
  this.web = '';
  this.contact = '';
  this.resources = [];
  this.parameters = [];
  this.areas = [];
};

// Geo, Met, Safety, Security, Rescue, Fire, Health, Env, Transport, Infra,
// CBRNE, Other.
Info.prototype.addCategory = function(category) {
  this.categories.push(category);
};

// Shelter, Evacuate, Prepare,  Execute, Avoid, Monitor, Assess, AllClear
Info.prototype.addResponseType = function(responseType) {
  this.responseTypes.push(responseType);
};
Info.prototype.addEventCode = function(valueName, value) {
  var eventCode = new EventCode(valueName, value);
  this.eventCodes.push(eventCode);
};

Info.prototype.addParameter = function(valueName, value) {
  var parameter = new Parameter(valueName, value);
  this.parameters.push(parameter);
};
Info.prototype.addArea = function(areaDesc) {
  var area = new Area(areaDesc);
  this.areas.push(area);
  return area;
};
Info.prototype.addResource = function(resourceDesc) {
  var resource = new Resource(resourceDesc);
  this.resources.push(resource);
  return resource;
};

var EventCode = function(valueName, value) {
  this.valueName = valueName = value;
  this.value;
};

var Parameter = function(valueName, value) {
  this.valueName = valueName;
  this.value = value;
};


//RESOURCE Object
var Resource = function(resourceDesc) {
  this.resourceDesc = resourceDesc;  // REQUIRED
  this.mimeType;
  this.uri;
  this.digest;
  // note: derefURI is not implemented in this tool
};
Resource.prototype.getJSON = function() {
  return JSON.stringify(this);
};


// AREA Object
var Area = function() {
  this.areaDesc = '';  // REQUIRED
  this.polygons = [];
  this.circles = [];
  this.geocodes = [];
  this.altitude = '';
  this.ceiling = '';
};

Area.prototype.addPolygon = function(polygon) {
  this.polygons.push(polygon);
};

Area.prototype.addCircle = function(circle) {
  this.circles.push(circle);
};

Area.prototype.addGeocode = function(valueName, value) {
  var geocode = new Geocode(valueName, value);
  this.geocodes.push(geocode);
};

var Geocode = function(valueName, value) {
  this.valueName = valueName;
  this.value = value;
};

// UTILITIES

//parse XML string into an Alert object
function parseCAP2Alert(cap_xml) {
  var xml = typeof cap_xml === 'object' ? cap_xml : $.parseXML(cap_xml);
  // populate new alert with values from XML
  var alert = new Alert();
  alert.identifier = $(xml).find('identifier').text();
  alert.sender = $(xml).find('sender').text();
  alert.sent = $(xml).find('sent').text();
  alert.status = $(xml).find('status').text();
  alert.msgType = $(xml).find('msgType').text();
  alert.source = $(xml).find('source').text();
  alert.scope = $(xml).find('scope').text();
  alert.restriction = $(xml).find('restriction').text();
  alert.addresses = $(xml).find('addresses').text();
  alert.code = $(xml).find('code').text();
  alert.note = $(xml).find('note').text();
  alert.references = $(xml).find('references').text();
  alert.incidents = $(xml).find('incidents').text();
  var info = alert.addInfo();  // only one Info is supported in current version!
  info.language = $(xml).find('language').text();
  $(xml).find('category').each(function() {
    info.addCategory($(this).text());
  });
  info.event = $(xml).find('event').text();
  $(xml).find('responseType').each(function() {
    info.addResponseType($(this).text());
  });
  info.urgency = $(xml).find('urgency').text();
  info.severity = $(xml).find('severity').text();
  info.certainty = $(xml).find('certainty').text();
  info.audience = $(xml).find('audience').text();
  $(xml).find('eventCode').each(function() {
    info.addEventCode($(this).text());
  });
  info.effective = $(xml).find('effective').text();
  info.onset = $(xml).find('onset').text();
  info.expires = $(xml).find('expires').text();
  info.senderName = $(xml).find('senderName').text();
  info.headline = $(xml).find('headline').text();
  info.description = $(xml).find('description').text();
  info.instruction = $(xml).find('instruction').text();
  info.web = $(xml).find('web').text();
  info.contact = $(xml).find('contact').text();
  $(xml).find('resource').each(function() {
    var resource = info.addResource();
    resource.resourceDesc = $(this).find('areaDesc').text();
    resource.mimeType = $(this).find('mimeType').text();
    resource.uri = $(this).find('uri').text();
    resource.digest = $(this).find('digest').text();
  });
  $(xml).find('parameter').each(function() {
    var parameter = info.addParameter(
        $(this).find('valueName').text(), $(this).find('value').text());
  });
  var area = info.addArea();  // Only one Area is supported in current version!
  area.areaDesc = $(xml).find('areaDesc').text();
  $(xml).find('polygon').each(function() {
    area.addPolygon($(this).text());
  });
  $(xml).find('circle').each(function() {
    area.addCircle($(this).text());
  });
  $(xml).find('geocode').each(function() {
    var geocode = area.addGeocode(
        $(this).find('valueName').text(), $(this).find('value').text());
  });
  area.altitude = $(xml).find('altitude').text();
  area.ceiling = $(xml).find('ceiling').text();
  return alert;
}


//////////////////////////////////////////////////////
// trivial example code (uncomment to test from command line)
/*
newAlert = new Alert();
info = newAlert.addInfo();
info.addParameter("parameter_type", "silly");
// testing unicode, that's Thai for Bangkok
area = info.addArea("กรุงเทพมหานคร");
area.addCircle("100.54386,13.81390 30.99990");
alert(newAlert.getJSON());
*/
