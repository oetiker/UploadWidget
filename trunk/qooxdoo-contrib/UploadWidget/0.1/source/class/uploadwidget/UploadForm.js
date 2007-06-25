/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007 Visionet GmbH, http://www.visionet.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Dietrich Streifert (level420)

************************************************************************ */

/* ************************************************************************

#module(ui_io)
#require(qx.xml.Document)

************************************************************************ */

/**
 * An upload widget implementation capable of holding multiple upload buttons
 * and upload fields.
 * 
 * Each upload form creates an iframe which is used as a target for form submit.
 * 
 *
 */
qx.Class.define("uploadwidget.UploadForm",
{
  extend : qx.ui.layout.CanvasLayout,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param name {String} form name ({@link #name}).
   * @param url {String} url name ({@link #url}).
   */
  construct : function(name, url)
  {
    this.base(arguments);

    this._parameters = {};
    this._hidden = {};

    // Apply initial values
    this.setName(name);
    this.setUrl(url);

    // Initialize Properties
    this.setHeight('auto');
    this.setSelectable(false);
    this.setHtmlProperty('enctype','multipart/form-data');
    this.setStyleProperty('line-height','0');

    var vUniqueId = (new Date).valueOf();
    var vFrameName = "frame_" + vUniqueId;
  
    if (qx.core.Variant.isSet("qx.client", "mshtml")) {
      this._iframeNode = document.createElement('<iframe name="' + vFrameName + '"></iframe>');
    } else {
      this._iframeNode = document.createElement("iframe");
    }
  
    this._iframeNode.src = "javascript:void(0)";
    this._iframeNode.id = this._iframeNode.name = vFrameName;
  
    this._iframeNode.style.display = "none";
  
    this.setTarget(vFrameName);
  
    document.body.appendChild(this._iframeNode);
  
    var o = this;
    this._iframeNode.onload = function(e) { return o._onload(e); }
    this._iframeNode.onreadystatechange = function(e) { return o._onreadystatechange(e); }
  },

  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events:
  {
    "sending"    : "qx.event.type.Event",
    "completed"  : "qx.event.type.Event"
  },

  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * The name which is assigned to the form
     */
    name :
    {
      init : "",
      nullable : false
    },

    /**
     * The url which is used for form submission.
     */
    url :
    {
      init : "",
      nullable : false
    },

    /**
     * The target which is used for form submission.
     */
    target :
    {
      init : "",
      nullable : false
    },

    /**
     * Determines what type of request to issue (GET or POST).
     */
    method :
    {
      check : [ qx.net.Http.METHOD_GET, qx.net.Http.METHOD_POST, qx.net.Http.METHOD_PUT, qx.net.Http.METHOD_HEAD, qx.net.Http.METHOD_DELETE ],
      init : qx.net.Http.METHOD_POST
    }
  },
  

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      UTILITIES
    ---------------------------------------------------------------------------
    */

    /**
     * Create an empty form widget. IE is not able to change the enctype
     * after element creation, so the enctype is set by using a skeleton
     * form tag as parameter for createElement.
     *
     * @type member
     * @return {void}
     */
    _createElementImpl : function() {
      var tagName;
      if (qx.core.Variant.isSet("qx.client", "mshtml")) {
        tagName ='<form enctype="multipart/form-data"></form>';
      } else {
        tagName = 'form';
      }
      // this.debug('tagName: ' + tagName);
      this.setElement(this.getTopLevelWidget().getDocumentElement().createElement(tagName));
    },

    /**
     * Add parameters as hidden fields to the form.
     *
     * @type member
     * @return {object}
     */
    _addFormParameters : function() {
      var form = this.getElement();
      var parameters = this.getParameters();

      for (var id in parameters) {
        // this.debug('_addFormParameters name: ' + this._hidden[id].name + ', value: ' + this._hidden[id].value);
        form.appendChild(this._hidden[id]);
      }
    },


    /**
     * Create an input element of type hidden with the 
     * name ({@link #name}) and value ({@link #value})
     *
     * @type member
     * @param name {String} name attribute of the created element ({@link #name}).
     * @param value {String} value attribute of the created element ({@link #value}).
     * @return {void}
     */
    _createHiddenFormField : function(name,value) {
      var hvalue = document.createElement("input");
      hvalue.type = "hidden";
      hvalue.name = name;
      hvalue.value = value;
    
      // this.debug('_createHiddenFormField name: ' + name + ', value: ' + value);
      return hvalue;
    },


    /**
     * Add a parameter to the request.
     * 
     * @param id String identifier of the parameter to add.
     * @param value String Value of parameter.
     * @return {void}
     */
    setParameter : function(id, value) {
      // this.debug('setParameter id: ' + id + ', value: ' + value);
      this._parameters[id] = value;
      if(this._hidden[id] && this._hidden[id].name) {
        // this.debug('set old value');
        this._hidden[id].value = value;
      }
      else {
        // this.debug('created new hidden field');
        this._hidden[id] = this._createHiddenFormField(id, value);
      }
    },

    /**
     * Remove a parameter from the request.
     * 
     * @param id String identifier of the parameter to remove.
     * @return {void}
     */
    removeParameter : function(id) {
      delete this._parameters[id];
      if(this._hidden[id] && this._hidden[id].parentNode) {
        this._hidden[id].parentNode.removeChild(this._hidden[id]);
      }
      delete this._hidden[id];
    },

    /**
     * Get a parameter in the request.
     * 
     * @param id String identifier of the parameter to get.
     * @return {String}
     */
    getParameter : function(id) {
      return this._parameters[id] || null;
    },
    
    /**
     * Returns the array containg all parameters for the request.
     * 
     * @return {Array}
     */
    getParameters : function() {
      return this._parameters;
    },


    /**
     * Send the form via the submit method. Target defaults to the
     * self created iframe.
     * 
     * @return {void}
     */
    send :  function() {
      var form = this.getElement();
      if(form) {
        this._addFormParameters();
    
        form.target = this.getTarget();
        form.action = this.getUrl();
        form.method = this.getMethod();
    
        // this.debug("target: " + form.target);
        // this.debug("action: " + form.action);
        // this.debug("method: " + form.method);
        // this.debug("enctype: " + form.enctype);
    
        form.submit();
        this._isSent = true;
        this.createDispatchEvent("sending");
      }
      else {
        throw new Error("Form element not created! Unable to call form submit!");
      }
    },


    /*
    ---------------------------------------------------------------------------
      FRAME UTILITIES
    ---------------------------------------------------------------------------
    */
    
    getIframeWindow : function() {
      return qx.html.Iframe.getWindow(this._iframeNode);
    },
    
    getIframeDocument : function() {
      return qx.html.Iframe.getDocument(this._iframeNode);
    },
    
    getIframeBody : function() {
      return qx.html.Iframe.getBody(this._iframeNode);
    },
    
    getIframeNode : function() {
      return this._iframeNode;
    },


    /*
    ---------------------------------------------------------------------------
      RESPONSE DATA SUPPORT
    ---------------------------------------------------------------------------
    */
    
    getIframeTextContent : function() {
      var vBody = this.getIframeBody();
    
      if (!vBody) {
        return null;
      }
    
      // Mshtml returns the content inside a PRE
      // element if we use plain text
      if (vBody.firstChild && (vBody.firstChild.tagName == "PRE" || vBody.firstChild.tagName == "pre"))
      {
        return vBody.firstChild.innerHTML;
      }
      else
      {
        return vBody.innerHTML;
      }
    },
    
    getIframeHtmlContent : function() {
      var vBody = this.getIframeBody();
      return vBody ? vBody.innerHTML : null;
    },
    
    getIframeXmlContent : function() {
      var responsetext = this.getIframeTextContent();
    
      if(!responsetext || responsetext.length == 0) {
        return null;
      }
    
      var xmlContent = null;
      var newText = responsetext.replace(/&lt;/g,"<");
      newText = newText.replace(/&gt;/g, ">");
    
      try {
        xmlContent = qx.xml.Document.fromString(newText);
      }
      catch(ex) {};
    
      return xmlContent;
    },

    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER
    ---------------------------------------------------------------------------
    */
    
    _onreadystatechange : function() {
      if (this.getIframeNode().readyState == "complete" && this._isSent) {
        this.createDispatchEvent("completed");
        delete this._isSent;
      }
    },
    
    _onload : function() {
      if(this._isSent) {
        this.createDispatchEvent("completed");
        delete this._isSent;
      }
    }
  },

  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    document.body.removeChild(this._iframeNode);
    this._iframeNode.onreadystatechange = null;
    this._iframeNode.onload = null;
    this._iframeNode = null;
  
    this._parameters = null;
  
    for (var vId in this._hidden) {
      if(this._hidden[vId] && this._hidden[vId].parentNode) {
        this._hidden[vId].parentNode.removeChild(this._hidden[vId]);
      }
    }
  }
});  

