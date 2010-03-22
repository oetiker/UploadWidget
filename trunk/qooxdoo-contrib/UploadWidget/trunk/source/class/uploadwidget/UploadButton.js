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
        qx.bom.element.Attribute.set(this._qxElement.getDomElement(), "name", value);
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
        delete this._valueInputOnChange;
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
        qx.bom.element.Attribute.set(this._qxElement.getDomElement(), "value", "");
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
        qx.bom.element.Attribute.set(this._qxElement.getDomElement(), "disabled", (value === false));
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
     * Use wrapper. When materialized, qooxdoo adds 'input' element
     * to container.
     * 
     * @param inputElem {qx.bom.Element}
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
        this._qxElement.destroy();
        this._qxElement = null;
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

      var input = qx.bom.Element.create("input", {
        name : this.getFieldName(),
        type : "file",
        disabled : this.getEnabled() === false
      });

      var Style = qx.bom.element.Style;
      Style.setStyles(input, {
        position  : "absolute",
        left      : "-" + uploadwidget.UploadButton.POSITION_LEFT + "px",
        fontSize  : "60px",
        zIndex    : "100",
        cursor    : "pointer",
        hidefocus : "true"
      });

      if (qx.core.Variant.isSet("qx.client", "gecko")) {
        Style.set(input, "mozOutlineStyle", "none");
      }

      if (qx.core.Variant.isSet("qx.client", "mshtml")) {
        Style.set(input, "filter", "alpha(opacity=0)");
      } else {
        Style.set(input, "opacity", "0");
      }

      this._setInputSize(input, this._computeInputSize());

      qx.event.Registration.addListener(input, "change", this._onChange, this);

      var qxElement = this._createInputWrapper(input);
      el.add(qxElement);

      return qxElement;
    },


    /**
     * @return {Map}
     */
    _computeInputSize : function ()
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
    _setInputSize: function(input, bounds)
    {
      if (!input) {
        return
      }

      var left = uploadwidget.UploadButton.POSITION_LEFT;

      qx.bom.element.Style.setStyles(input, {
        clip   : "rect(auto, " + (left + 1 + bounds.width) + 
                 "px, auto, "+(left - 1)+"px)",
        height : (bounds.height * 2) + "px",
        width  : (left + 1 + bounds.width) + "px"
      });
    },


    /**
     * @param e {Event}
     * @return {void}
     */
    _onuploadresize: function(e)
    {
      if (this._containsInputElement()) {
        this._setInputSize(this._qxElement.getDomElement(), e.getData());
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
        this.setFieldValue(qx.bom.element.Attribute.get(this._qxElement.getDomElement(), "value"));
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