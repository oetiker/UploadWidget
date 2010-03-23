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
   
   Contributors:
     * Petr Kobalicek (e666e)

************************************************************************ */

/* ************************************************************************

#module(uploadwidget_ui_io)

************************************************************************ */

/**
 * An upload button which allows selection of a file through the browser fileselector.
 *
 */
qx.Class.define("uploadwidget.UploadButton",
{
  extend : qx.ui.form.Button,

  // --------------------------------------------------------------------------
  // [Constructor]
  // --------------------------------------------------------------------------

  construct: function(fieldName, label, icon, command)
  {
    this.base(arguments, label, icon, command);

    if (fieldName) {
      this.setFieldName(fieldName);
    }

    this._qxElement = this._createInputFileTag(this.getContainerElement());

    this.addListener("resize", this._onuploadresize, this);

    // Fix for bug #3027
    if (qx.core.Variant.isSet("qx.client", "opera")) {
      this.setSelectable(true);
    }
  },


  // --------------------------------------------------------------------------
  // [Statics]
  // --------------------------------------------------------------------------

  statics : {
    POSITION_LEFT : 790
  },


  // --------------------------------------------------------------------------
  // [Properties]
  // --------------------------------------------------------------------------

  properties:
  {
    /**
     * The field name which is assigned to the form
     */
    fieldName :
    {
      check : "String",
      init : "",
      apply : "_applyFieldName"
    },

    /**
     * The value which is assigned to the form
     */
    fieldValue :
    {
      check : "String",
      init : "",
      apply : "_applyFieldValue",
      event : "changeFieldValue"
    }
  }, 
  
  // --------------------------------------------------------------------------
  // [Members]
  // --------------------------------------------------------------------------

  members :
  {

    _qxElement : null,
    _valueInputOnChange : false,

    // overridden
    capture : qx.core.Variant.select("qx.client",
    {
      "mshtml" : function() {
        this.__mouseUpListenerId = this.getApplicationRoot().addListenerOnce("mouseup", this._onMouseUp, this);
      },

      "default" : function() {
        this.base(arguments);
      }
    }),


    // overridden
    releaseCapture : qx.core.Variant.select("qx.client",
    {
      "mshtml" : qx.lang.Function.empty,

      "default" : function() {
        this.base(arguments);
      }
    }),


    // ------------------------------------------------------------------------
    // [Modifiers]
    // ------------------------------------------------------------------------

    /**
     * Modifies the name property of the hidden input type=file element.
     *
     * @type member
     * @param value {var} Current value
     * @param old {var} Previous value
     */
    _applyFieldName : function(value, old)
    {
      if (this._containsInputElement()) {
        qx.bom.element.Attribute.set(this._getInputDomElement(), "name", value);
      }
    },


    /**
     * Modifies the value property of the hidden input type=file element.
     * Only an empty string is accepted for clearing out the value of the
     * selected file.
     * 
     * As a special case for IE the hidden input element is recreated because
     * setting the value is generally not allowed in IE.
     *
     * @type member
     * @param value {var} Current value
     * @param old {var} Previous value
     */
    _applyFieldValue : function(value, old)
    {
      if(this._valueInputOnChange)
      {
        this._valueInputOnChange = false;
      }
      else
      {
        if (!value || value == "")
        {
          if (qx.core.Variant.isSet("qx.client", "mshtml")) {
            this._qxElement = this._createInputFileTag(this.getContainerElement());
          } else {
            this._resetValue();
          }
        }
        else
        {
          throw new Error("Unable to set value to non null or non empty!");
        }
      }
    },


    /**
     * @return {void}
     */
    _resetValue : function ()
    {
      if (this._containsInputElement()) {
        qx.bom.element.Attribute.set(this._getInputDomElement(), "value", "");
      }
    },


    /**
     * Apply the enabled property.
     *
     * @type member
     * @param value {Boolean} Current value
     * @param old {Boolean} Previous value
     */
    _applyEnabled : function(value, old)
    {
      if (this._containsInputElement()) {
        qx.bom.element.Attribute.set(this._getInputDomElement(), "disabled", (value === false));
      }

      return this.base(arguments, value, old);
    },


    /**
     * @return {Boolean}
     */
    _containsInputElement : function () {
      return (this._qxElement instanceof qx.html.Element && !this._qxElement.isDisposed());
    },


    /**
     * @return {qx.html.Element}
     */
    _getInputElement : function () {
      return this._qxElement;
    },


    /**
     * @return {qx.dom.Element}
     */
    _getInputDomElement : function () {
      return this._qxElement.getDomElement();
    },


    /**
     * Use wrapper. When materialized, qooxdoo adds 'input' element
     * to container.
     * 
     * @param inputElem {qx.dom.Element}
     * @return {qx.html.Element}
     */
    _createInputWrapper : function (inputElem)
    {
      var elem = new qx.html.Element();
      elem.useElement(inputElem);

      return elem;
    },


    /**
     * @return {void}
     */
    _disposeInputElement : function ()
    {
      if(this._containsInputElement())
      {
        var elem = this._getInputElement();
        elem.dispose();
        elem = null;
      }
    },


    // ------------------------------------------------------------------------
    // [Event Handlers]
    // ------------------------------------------------------------------------


    /**
     * Create an input type=file element, and set the onchange event handler which
     * fires if the user selected a file with the fileselector.
     *
     * @type member
     * @param el {Element|null}
     * @return {qx.html.Element}
     */
    _createInputFileTag : function(el)
    {
      this._disposeInputElement();

      var elem = qx.bom.Element.create("input", {
        name : this.getFieldName(),
        type : "file"
      });

      this._setStyles(elem);
      this._setSize(elem, this._computeSize());

      qx.event.Registration.addListener(elem, "change", this._onChange, this);

      var qxElem = this._createInputWrapper(elem);
      el.add(qxElem);

      return qxElem;
    },


    /**
     * @param elem {qx.dom.Element}
     * @return {void}
     */
    _setStyles : function (elem)
    {
      var Style = qx.bom.element.Style;

      qx.bom.element.Attribute.set(elem, "hideFocus", "true");

      Style.setStyles(elem, {
        position  : "absolute",
        left      : uploadwidget.UploadButton.POSITION_LEFT * -1,
        fontSize  : "60px",
        zIndex    : 100,
        cursor    : "pointer",
        hideFocus : "true"
      });

      if (qx.core.Variant.isSet("qx.client", "gecko")) {
        Style.set(elem, "mozOutlineStyle", "none");
      }

      Style.set(elem, "opacity", "0");
    },


    /**
     * @return {Map}
     */
    _computeSize : function ()
    {
      var bounds = this.getBounds();

      return {
        width  : bounds && bounds.width ? bounds.width : 16,
        height : bounds && bounds.height ? bounds.height : 16
      };
    },


    /**
     * @param input {Element}
     * @param bounds {Map}
     * @return {void}
     */
    _setSize : function(input, bounds)
    {
      if (!input) {
        return
      }

      var left = uploadwidget.UploadButton.POSITION_LEFT;

      qx.bom.element.Style.setStyles(input, {
        clip   : {
          width : bounds.width,
          left  : left - 1
        },
        height : bounds.height * 2,
        width  : left + bounds.width
      });
    },


    /**
     * @param e {Event}
     * @return {void}
     */
    _onuploadresize: function(e)
    {
      if (this._containsInputElement()) {
        this._setSize(this._getInputDomElement(), e.getData());
      }
    },


    /**
     * Handle the onchange event of the hidden input type=file element
     *
     * @type member
     * @param e {Event} TODOC
     * @return {void}
     */
    _onChange : function(e)
    {
      this._valueInputOnChange = true;

      if (this._containsInputElement()) {
        this.setFieldValue(qx.bom.element.Attribute.get(this._getInputDomElement(), "value"));
      }
    }
  },


  destruct : function()
  {
    this._disposeInputElement();

    if (this.__mouseUpListenerId) {
      this.getApplicationRoot().removeListenerById(this.__mouseUpListenerId);
    }
  }
});