(this["webpackJsonpremote-ctrl-ui"]=this["webpackJsonpremote-ctrl-ui"]||[]).push([[0],{199:function(e,t,n){},200:function(e,t,n){},356:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(29),s=n.n(i),c=(n(199),n.p,n(200),n(14)),o=n.n(c),u=n(22),d=n(30),l=n(31),h=n(35),p=n(34),v=n(187),f=n.n(v),g=n(71),m=n(84),j=n.n(m),O=n(363),b=n(364),x=n(365),k=n(140),S=n.n(k),y=n(201),w="";function I(e){console.error("error:",e.data)}function C(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"GET",n=arguments.length>2?arguments[2]:void 0;return new Promise((function(a,r){y({url:e,method:t,headers:n,transformResponse:function(e){return e},withCredentials:!0,timeout:29e3}).then((function(e){a(e)})).catch((function(e){I(e),r(e)}))}))}function A(e){return P.apply(this,arguments)}function P(){return(P=Object(u.a)(o.a.mark((function e(t){var n,a,r=arguments;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=r.length>1&&void 0!==r[1]?r[1]:"GET",a=r.length>2?r[2]:void 0,e.next=4,C("".concat(w).concat(t),n,a);case 4:return e.abrupt("return",e.sent);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function D(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"POST",n=arguments.length>2?arguments[2]:void 0,a=arguments.length>3?arguments[3]:void 0;return new Promise((function(r,i){y({url:e,method:t,data:n,transformResponse:function(e){return e},headers:a,withCredentials:!0,timeout:29e3}).then((function(e){r(e)})).catch((function(e){I(e),i(e)}))}))}function T(e){return M.apply(this,arguments)}function M(){return(M=Object(u.a)(o.a.mark((function e(t){var n,a,r,i,s=arguments;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=s.length>1&&void 0!==s[1]?s[1]:"POST",a=s.length>2?s[2]:void 0,r=s.length>3?s[3]:void 0,(i=r||{})["Content-Type"]="application/json",e.next=7,D("".concat(w).concat(t),n,JSON.stringify(a),i);case 7:return e.abrupt("return",e.sent);case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var U=n(362),V=n(360),N=n(54),J=n(50),L={servicePort:"Service Port",uiPort:"UI Port",smartthingsAppId:"Smartthings Application Id",smartthingsAppSecret:"Smartthings Application Secret",save:"Save",settings:"Settings",devices:"Devices",addDevice:"Add Device",users:"Users",addUser:"Add User",actionId:"Action",deviceLabel:"Device Label",cooling10Mins:"Cooling 10 Mins",cooling20Mins:"Cooling 20 Mins",cooling30Mins:"Cooling 30 Mins",windscreen10Mins:"Windscreen 10 Mins",windscreen20Mins:"Windscreen 20 Mins",windscreen30Mins:"Windscreen 30 Mins",heating10Mins:"Heating 10 Mins",heating20Mins:"Heating 20 Mins",heating30Mins:"Heating 30 Mins",airconOn:"Air conditioner On",airconOff:"Air conditioner Off",headlightsOn:"Headlights On",headlightsOff:"Headlights Off",parkinglightsOn:"Parkinglights On",parkinglightsOff:"Parkinglights Off",username:"Username",password:"Password",delete:"Delete",shard:"Smartthings Portal Shard",macAddress:"Outlander PHEV Client Mac Address",keycloakJson:"Securing Applications using keycloak.json"};function E(){return L}var H=n(188),R=n(76),_=n(7),K=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(d.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={settings:{},servicePort:"",uiPort:"",smartthingsAppId:"",smartthingsAppSecret:"",macAddress:"",changed:!1,loading:!1,error:"",keycloakJson:""},e}return Object(l.a)(n,[{key:"reload",value:function(){var e=Object(u.a)(o.a.mark((function e(){var t,n,a;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A("/ui/settings");case 2:t=e.sent,n=t.data,a=JSON.parse(n),this.setState({settings:a,servicePort:a.data.port,uiPort:a.data.portUI,smartthingsAppId:a.data.smartthings.appId,smartthingsAppSecret:a.data.smartthings.appSecret,macAddress:a.data.macAddress,shard:a.data.smartthings.shard,authenticationType:a.data.connectionType});case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"onSaveClick",value:function(){var e=Object(u.a)(o.a.mark((function e(){var t,n,a,r,i,s,c,u,d,l,h,p,v;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.state,n=t.uiPort,a=t.servicePort,r=t.settings,i=t.smartthingsAppId,s=t.smartthingsAppSecret,c=t.macAddress,u=t.keycloakJson,d=t.shard,this.setState({loading:!0}),l=JSON.parse(JSON.stringify(r.data)),i&&(l.smartthings.appId=i),s&&(l.smartthings.appSecret=s),d&&(l.smartthings.shard=d),c&&(l.macAddress=c),a&&(l.port=a),n&&(l.portUI=n),e.prev=9,e.next=12,A("/ui/smartthings/check?appId=".concat(i,"&secret=").concat(s));case 12:if(h=e.sent,"OK"!==(p=JSON.parse(h.data)).status){e.next=37;break}return e.next=17,T("/ui/settings","POST",l);case 17:if(h=e.sent,"OK"!==(p=JSON.parse(h.data)).status){e.next=34;break}if(v={changed:!1},!u){e.next=27;break}return e.next=24,T("/ui/settings/saveKeycloak","POST",{keycloakJson:u});case 24:h=e.sent,"OK"!==(p=JSON.parse(h.data)).status?v.error=p.message:v.error="";case 27:return e.next=29,this.props.reload();case 29:return e.next=31,this.reload();case 31:this.setState(v),e.next=35;break;case 34:this.setState({error:p.message});case 35:e.next=38;break;case 37:this.setState({error:p.message});case 38:return e.prev=38,this.setState({loading:!1}),e.finish(38);case 41:case"end":return e.stop()}}),e,this,[[9,,38,41]])})));return function(){return e.apply(this,arguments)}}()},{key:"getColumns",value:function(){var e=this;return[{title:"Name",dataIndex:"name",key:"name",render:function(e){return Object(_.jsx)("a",{children:E()[e]||e})}},{title:"Value",dataIndex:"value",key:"value",render:function(t,n){var a=e.state[n.name];return"macAddress"===n.name?Object(_.jsx)(H.a,{mask:"##:##:##:##:##:##",name:E().macAddress||t,value:a,placeholder:"xx:xx:xx:xx:xx:xx",onChange:function(t){if(t.target.value&&!t.target.value.includes("_")){var n={changed:!0};n.macAddress=t.target.value,e.setState(n)}}}):"keycloakJson"===n.name?Object(_.jsx)(R.a,{onChange:function(t){if(t.target.value){var n={changed:!0};n.keycloakJson=t.target.value,e.setState(n)}},placeholder:"Keycloak Json",autoSize:{minRows:3,maxRows:5}}):"shard"===n.name?a:Object(_.jsx)(J.a,{editable:{onChange:function(t){if(t){var a={changed:!0};a[n.name]=t,e.setState(a)}}},children:a})}}]}},{key:"componentDidMount",value:function(){var e=Object(u.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.reload();case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=this.state,n=t.settings,a=t.changed,r=t.loading,i=t.error;if("OK"===n.status){var s=[{name:"macAddress",value:n.data.macAddress},{name:"shard",value:n.data.smartthings.shard},{name:"smartthingsAppId",value:n.data.smartthings.appId},{name:"smartthingsAppSecret",value:n.data.smartthings.appSecret},{name:"keycloakJson",value:""}];return Object(_.jsxs)("div",{children:[i?Object(_.jsx)(U.a,{message:i,showIcon:!0,type:"error",closable:!0}):null,Object(_.jsx)(V.a,{columns:this.getColumns(),dataSource:s}),Object(_.jsx)(N.a,{type:"primary",loading:r,block:!0,disabled:!a,onClick:function(){e.onSaveClick()},children:E().save||"Save"})]})}return null}}]),n}(a.Component),G=n(93),F=n(361),W=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(d.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={loading:!1,canSave:!1,deviceLabel:"",actionId:""},e}return Object(l.a)(n,[{key:"onSaveClick",value:function(){var e=Object(u.a)(o.a.mark((function e(){var t,n,a,r;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.state,n=t.deviceLabel,a=t.actionId,this.setState({loading:!0}),e.prev=2,r=Object(F.a)(),e.next=6,T("/ui/settings/addDevice","POST",{id:r,deviceLabel:n,actionId:a});case 6:return e.next=8,this.props.reload(Q.SmartthingsViewDevice,r);case 8:return e.prev=8,this.setState({loading:!1}),e.finish(8);case 11:case"end":return e.stop()}}),e,this,[[2,,8,11]])})));return function(){return e.apply(this,arguments)}}()},{key:"validation",value:function(e,t){return e||this.state.deviceLabel&&t||this.state.actionId}},{key:"onActionChange",value:function(e){this.setState({actionId:e,canSave:this.validation(null,e)})}},{key:"getColumns",value:function(){var e=this;return[{title:"Name",dataIndex:"name",key:"name",render:function(e){return Object(_.jsx)("a",{children:E()[e]||e})}},{title:"Value",dataIndex:"value",key:"value",render:function(t,n){var a=e.state[n.name];return"actionId"===n.name?Object(_.jsxs)(G.a,{style:{width:200},onChange:function(t){e.onActionChange(t)},children:[Object(_.jsx)(G.a.Option,{value:"airconOn",children:E().airconOn}),Object(_.jsx)(G.a.Option,{value:"airconOff",children:E().airconOff}),Object(_.jsx)(G.a.Option,{value:"headlightsOn",children:E().headlightsOn}),Object(_.jsx)(G.a.Option,{value:"headlightsOff",children:E().headlightsOff}),Object(_.jsx)(G.a.Option,{value:"parkinglightsOn",children:E().parkinglightsOn}),Object(_.jsx)(G.a.Option,{value:"parkinglightsOff",children:E().parkinglightsOff})]}):Object(_.jsx)(J.a,{editable:{onChange:function(t){if(t){var a={canSave:e.validation(t)};a[n.name]=t,e.setState(a)}}},children:a})}}]}},{key:"render",value:function(){var e=this,t=this.state,n=t.loading,a=t.canSave,r=t.actionId,i=[{name:"deviceLabel",value:t.deviceLabel},{name:"actionId",value:r}];return Object(_.jsxs)("div",{children:[Object(_.jsx)(V.a,{columns:this.getColumns(),dataSource:i}),Object(_.jsx)(N.a,{type:"primary",loading:n,block:!0,disabled:!a,onClick:Object(u.a)(o.a.mark((function t(){return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.onSaveClick();case 2:case"end":return t.stop()}}),t)}))),children:E().save||"Save"})]})}}]),n}(a.Component),B=n(185),z=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(d.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={loadingPage:!1,loading:!1,canSave:!1,deviceLabel:"",actionId:"",deviceId:""},e}return Object(l.a)(n,[{key:"reload",value:function(){var e=Object(u.a)(o.a.mark((function e(){var t,n,a,r,i=this;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.setState({loadingPage:!0}),e.next=3,A("/ui/settings");case 3:t=e.sent,n=t.data,a=JSON.parse(n),r=a.data.smartthings.devices.find((function(e){return e.id===i.props.deviceId})),this.setState({actionId:r.actionId,deviceLabel:r.deviceLabel,deviceId:r.id,loadingPage:!1});case 8:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"onDeleteClick",value:function(){var e=Object(u.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.state.deviceId,this.setState({loading:!0}),e.prev=2,e.next=5,T("/ui/settings/deleteDevice","POST",{deviceId:t});case 5:return e.next=7,this.props.reload(Q.SmartthingsSettings);case 7:return e.prev=7,this.setState({loading:!1}),e.finish(7);case 10:case"end":return e.stop()}}),e,this,[[2,,7,10]])})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){var e=Object(u.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.reload();case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidUpdate",value:function(){var e=Object(u.a)(o.a.mark((function e(t){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.props.deviceId===t.deviceId){e.next=3;break}return e.next=3,this.reload();case 3:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"onSaveClick",value:function(){var e=Object(u.a)(o.a.mark((function e(){var t,n,a,r;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.state,n=t.deviceLabel,a=t.actionId,r=t.deviceId,this.setState({loading:!0}),e.prev=2,e.next=5,T("/ui/settings/addDevice","POST",{id:r,deviceLabel:n,actionId:a});case 5:return e.next=7,this.props.reload(Q.SmartthingsViewDevice,r);case 7:return e.prev=7,this.setState({loading:!1}),e.finish(7);case 10:case"end":return e.stop()}}),e,this,[[2,,7,10]])})));return function(){return e.apply(this,arguments)}}()},{key:"validation",value:function(e,t){return e||this.state.deviceLabel&&t||this.state.actionId}},{key:"onActionChange",value:function(e){this.setState({actionId:e,canSave:this.validation(null,e)})}},{key:"getColumns",value:function(){var e=this;return[{title:"Name",dataIndex:"name",key:"name",render:function(e){return Object(_.jsx)("a",{children:E()[e]||e})}},{title:"Value",dataIndex:"value",key:"value",render:function(t,n){var a=e.state[n.name];return"actionId"===n.name?Object(_.jsxs)(G.a,{defaultValue:e.state.actionId,style:{width:200},onChange:function(t){e.onActionChange(t)},children:[Object(_.jsx)(G.a.Option,{value:"airconOn",children:E().airconOn}),Object(_.jsx)(G.a.Option,{value:"airconOff",children:E().airconOff}),Object(_.jsx)(G.a.Option,{value:"headlightsOn",children:E().headlightsOn}),Object(_.jsx)(G.a.Option,{value:"headlightsOff",children:E().headlightsOff}),Object(_.jsx)(G.a.Option,{value:"parkinglightsOn",children:E().parkinglightsOn}),Object(_.jsx)(G.a.Option,{value:"parkinglightsOff",children:E().parkinglightsOff})]}):"deviceId"===n.name?a:Object(_.jsx)(J.a,{editable:{onChange:function(t){if(t){var a={canSave:e.validation(t)};a[n.name]=t,e.setState(a)}}},children:a})}}]}},{key:"render",value:function(){var e=this,t=this.state,n=t.loading,a=t.loadingPage,r=t.canSave,i=t.actionId,s=[{name:"deviceId",value:t.deviceId},{name:"deviceLabel",value:t.deviceLabel},{name:"actionId",value:i}];return a?Object(_.jsx)(B.a,{}):Object(_.jsxs)("div",{children:[Object(_.jsx)(V.a,{columns:this.getColumns(),dataSource:s}),Object(_.jsx)(N.a,{type:"primary",loading:n,block:!0,disabled:!r,onClick:Object(u.a)(o.a.mark((function t(){return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.onSaveClick();case 2:case"end":return t.stop()}}),t)}))),children:E().save||"Save"}),Object(_.jsx)(N.a,{type:"primary",loading:n,block:!0,danger:!0,onClick:Object(u.a)(o.a.mark((function t(){return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.onDeleteClick();case 2:case"end":return t.stop()}}),t)}))),children:E().delete||"Delete"})]})}}]),n}(a.Component),Z=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(d.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={loading:!1,canSave:!1,username:"",password:""},e}return Object(l.a)(n,[{key:"onSaveClick",value:function(){var e=Object(u.a)(o.a.mark((function e(){var t,n,a,r,i;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.state,n=t.username,a=t.password,this.setState({loading:!0}),e.prev=2,r={users:[]},i=Object(F.a)(),r.users.push({id:i,username:n,password:a}),e.next=8,T("/ui/settings","POST",r);case 8:return e.next=10,this.props.reload(Q.ViewUser,i);case 10:return e.prev=10,this.setState({loading:!1}),e.finish(10);case 13:case"end":return e.stop()}}),e,this,[[2,,10,13]])})));return function(){return e.apply(this,arguments)}}()},{key:"validation",value:function(e){return(e.username||this.state.username)&&(e.password||this.state.password)}},{key:"onActionChange",value:function(e){this.setState({actionId:e,canSave:this.validation(null,e)})}},{key:"getColumns",value:function(){var e=this;return[{title:"Name",dataIndex:"name",key:"name",render:function(e){return Object(_.jsx)("a",{children:E()[e]||e})}},{title:"Value",dataIndex:"value",key:"value",render:function(t,n){var a=e.state[n.name];return Object(_.jsx)(J.a,{editable:{onChange:function(t){if(t){var a={};a[n.name]=t;var r={canSave:e.validation(a)};r[n.name]=t,e.setState(r)}}},children:a})}}]}},{key:"render",value:function(){var e=this,t=this.state,n=t.loading,a=t.canSave,r=[{name:"username",value:t.username},{name:"password",value:t.password}];return Object(_.jsxs)("div",{children:[Object(_.jsx)(V.a,{columns:this.getColumns(),dataSource:r}),Object(_.jsx)(N.a,{type:"primary",loading:n,block:!0,disabled:!a,onClick:Object(u.a)(o.a.mark((function t(){return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.onSaveClick();case 2:case"end":return t.stop()}}),t)}))),children:E().save||"Save"})]})}}]),n}(a.Component),q=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(d.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={loadingPage:!1,loading:!1,canSave:!1,username:"",password:"",userId:""},e}return Object(l.a)(n,[{key:"reload",value:function(){var e=Object(u.a)(o.a.mark((function e(){var t,n,a,r,i=this;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.setState({loadingPage:!0}),e.next=3,A("/ui/settings");case 3:t=e.sent,n=t.data,a=JSON.parse(n),r=a.data.users.find((function(e){return e.id===i.props.userId})),this.setState({username:r.username,password:r.password,userId:r.id,loadingPage:!1});case 8:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){var e=Object(u.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.reload();case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidUpdate",value:function(){var e=Object(u.a)(o.a.mark((function e(t){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.props.userId===t.userId){e.next=3;break}return e.next=3,this.reload();case 3:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"onSaveClick",value:function(){var e=Object(u.a)(o.a.mark((function e(){var t,n,a,r,i,s;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.state,n=t.username,a=t.password,r=t.userId,this.setState({loading:!0}),e.prev=2,s=r,(i={users:[]}).users.push({id:s,username:n,password:a}),e.next=8,T("/ui/settings","POST",i);case 8:return e.next=10,this.props.reload(Q.ViewUser,s);case 10:return e.prev=10,this.setState({loading:!1}),e.finish(10);case 13:case"end":return e.stop()}}),e,this,[[2,,10,13]])})));return function(){return e.apply(this,arguments)}}()},{key:"onDeleteClick",value:function(){var e=Object(u.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.state.userId,this.setState({loading:!0}),e.prev=2,e.next=5,T("/ui/settings/deleteUser","POST",{userId:t});case 5:return e.next=7,this.props.reload(Q.SmartthingsSettings);case 7:return e.prev=7,this.setState({loading:!1}),e.finish(7);case 10:case"end":return e.stop()}}),e,this,[[2,,7,10]])})));return function(){return e.apply(this,arguments)}}()},{key:"validation",value:function(e,t){return e||this.state.deviceLabel&&t||this.state.actionId}},{key:"onActionChange",value:function(e){this.setState({actionId:e,canSave:this.validation(null,e)})}},{key:"getColumns",value:function(){var e=this;return[{title:"Name",dataIndex:"name",key:"name",render:function(e){return Object(_.jsx)("a",{children:E()[e]||e})}},{title:"Value",dataIndex:"value",key:"value",render:function(t,n){var a=e.state[n.name];return"userId"===n.name?a:Object(_.jsx)(J.a,{editable:{onChange:function(t){if(t){var a={canSave:e.validation(t)};a[n.name]=t,e.setState(a)}}},children:"password"===n.name&&a?"*******":a})}}]}},{key:"render",value:function(){var e=this,t=this.state,n=t.loadingPage,a=t.loading,r=t.canSave,i=t.username,s=[{name:"userId",value:t.userId},{name:"username",value:i},{name:"password",value:t.password}];return n?Object(_.jsx)("spin",{}):Object(_.jsxs)("div",{children:[Object(_.jsx)(V.a,{columns:this.getColumns(),dataSource:s}),Object(_.jsx)(N.a,{type:"primary",loading:a,block:!0,disabled:!r,onClick:Object(u.a)(o.a.mark((function t(){return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.onSaveClick();case 2:case"end":return t.stop()}}),t)}))),children:E().save||"Save"}),Object(_.jsx)(N.a,{type:"primary",loading:a,block:!0,danger:!0,onClick:Object(u.a)(o.a.mark((function t(){return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.onDeleteClick();case 2:case"end":return t.stop()}}),t)}))),children:E().delete||"Delete"})]})}}]),n}(a.Component),Q={SmartthingsSettings:"SMARTTHINGS_SETTINGS",SmartthingsAddDevice:"SMARTTHINGS_ADD_DEVICE",SmartthingsViewDevice:"SMARTTHINGS_VIEW_DEVICE",AddUser:"ADD_USER",ViewUser:"VIEW_USER"},X=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){return Object(d.a)(this,n),t.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){var e=this.props.name,t=this.props.reload,n=this.props.id;return e===Q.SmartthingsSettings?Object(_.jsx)(K,{reload:t}):e===Q.SmartthingsAddDevice?Object(_.jsx)(W,{reload:t}):e===Q.SmartthingsViewDevice?Object(_.jsx)(z,{reload:t,deviceId:n}):e===Q.AddUser?Object(_.jsx)(Z,{reload:t}):e===Q.ViewUser?Object(_.jsx)(q,{reload:t,userId:n}):null}}]),n}(a.Component),Y=function(e){Object(h.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(d.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={collapsed:!1,selectorPage:null,settings:null,componentId:null},e.onCollapse=function(t){console.log(t),e.setState({collapsed:t})},e.reload=function(){var t=Object(u.a)(o.a.mark((function t(n,a){var r,i,s,c,u;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,A("/ui/settings");case 2:if(r=t.sent,i=r.data,!(s=JSON.parse(i)).data.smartthings.appId||!s.data.smartthings.appSecret){t.next=8;break}return t.next=8,A("/ui/settings/syncDevices");case 8:return t.next=10,A("/ui/settings");case 10:c=t.sent,s=JSON.parse(c.data),u={settings:s},n&&(u.selectorPage=n),a&&(u.componentId=a),e.setState(u);case 16:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}(),e.onSmartThingsSettingClick=function(){e.setState({selectorPage:Q.SmartthingsSettings})},e.onSmartThingsAddDeviceClick=function(){e.setState({selectorPage:Q.SmartthingsAddDevice})},e.onAddUsersClick=function(){e.setState({selectorPage:Q.AddUser})},e.onSmartThingsViewDeviceClick=function(t){e.setState({selectorPage:Q.SmartthingsViewDevice,componentId:t})},e.onViewUserClick=function(t){e.setState({selectorPage:Q.ViewUser,componentId:t})},e}return Object(l.a)(n,[{key:"componentDidMount",value:function(){var e=Object(u.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.reload();case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=this.state,n=t.collapsed,a=t.selectorPage,r=t.componentId,i=t.settings;return Object(_.jsxs)(j.a,{style:{minHeight:"100vh"},children:[Object(_.jsxs)(f.a,{collapsible:!0,collapsed:n,onCollapse:this.onCollapse,children:[Object(_.jsx)("div",{className:"logo"}),Object(_.jsxs)(g.a,{theme:"dark",defaultSelectedKeys:["1"],mode:"inline",children:[Object(_.jsx)(g.a.Item,{icon:Object(_.jsx)(O.a,{}),onClick:this.onSmartThingsSettingClick,children:E().settings},"1"),Object(_.jsxs)(S.a,{icon:Object(_.jsx)(b.a,{}),title:E().devices,disabled:!(i&&i.data.smartthings.appId&&i.data.smartthings.appSecret),children:[i&&i.data.smartthings.devices?i.data.smartthings.devices.map((function(t){return Object(_.jsx)(g.a.Item,{onClick:function(){e.onSmartThingsViewDeviceClick(t.id)},children:t.deviceLabel},t.id)})):null,Object(_.jsx)(g.a.Item,{onClick:this.onSmartThingsAddDeviceClick,children:E().addDevice},"addDevice")]},"devices"),i&&"local"===i.data.connectionType?Object(_.jsxs)(S.a,{icon:Object(_.jsx)(x.a,{}),title:E().users,children:[i&&i.data.users?i.data.users.map((function(t){return Object(_.jsx)(g.a.Item,{onClick:function(){e.onViewUserClick(t.id)},children:t.username},t.id)})):null,Object(_.jsx)(g.a.Item,{onClick:function(){e.onAddUsersClick()},children:E().addUser},"addUser")]},"sub1"):null]})]}),Object(_.jsxs)(j.a,{className:"site-layout",children:[Object(_.jsx)(m.Header,{className:"site-layout-background",style:{padding:0}}),Object(_.jsx)(X,{name:a||Q.SmartthingsSettings,id:r,reload:this.reload}),Object(_.jsx)(m.Footer,{style:{textAlign:"center"},children:" \xa92021 Created by Vasyl Zakharchenko"})]})]})}}]),n}(a.Component);var $=function(){return Object(_.jsx)("div",{children:Object(_.jsx)(Y,{})})},ee=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,366)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,i=t.getLCP,s=t.getTTFB;n(e),a(e),r(e),i(e),s(e)}))};s.a.render(Object(_.jsx)(r.a.StrictMode,{children:Object(_.jsx)($,{})}),document.getElementById("root")),ee()}},[[356,1,2]]]);
//# sourceMappingURL=main.91e6d520.chunk.js.map