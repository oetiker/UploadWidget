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

    if (fieldName) this.setFieldName(fieldName);
    this._createInputFileTag(this.getContainerElement());
    this.addListener("resize", this._onuploadresize, this);
  },
  
  // --------------------------------------------------------------------------
  // [Destructor]
  // --------------------------------------------------------------------------

  destruct : function()
  {
    var input = this._input;
    if (input)
    {
      if (input.parentNode){ //Can occur during dispose of layout parent
        input.parentNode.removeChild(input);
      }
      input.onchange = null;
      this._input = null;
    } 
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
      "mshtml" : function()
      {
        this.getApplicationRoot().addListenerOnce("mouseup", this._onMouseUp, this);
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
      if (this._input) this._input.name = value;
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
          if (qx.core.Variant.isSet("qx.client", "mshtml"))
          {
            this._createInputFileTag(this.getContainerElement());
          }
          else
          {
            this._input.value = "";
          }
        }
        else
        {
          throw new Error("Unable to set value to non null or non empty!");
        }
      }
    },

    /**
     * Apply the enabled property.
     *
     * @type member
     * @param value {var} Current value
     * @param old {var} Previous value
     */
    _applyEnabled : function(value, old)
    {
      if (this._input) this._input.disabled = (value === false);

      return this.base(arguments, value, old);
    },

    // ------------------------------------------------------------------------
    // [Event Handlers]
    // ------------------------------------------------------------------------
 
    /**
     * Create an input type=file element, and set the onchange event handler which
     * fires if the user selected a file with the fileselector.
     *
     * @type member
     * @param e {Event|null} appear event
     * @return {void}
     */
    _createInputFileTag : function(el)
    {
      // if (!el.getDomElement()) return;

      if(this._input)
      {
        this._input.name += "_tmp_";
        this._input.parentNode.removeChild(this._input);
        this._input = null;
      }

      var input  = (this._input = document.createElement("input"));
      input.type = "file";
      input.name = this.getFieldName();
      input.style.position  = "absolute";
      input.style.left      = "-790px";
      input.style.fontSize  = "60px";
      input.style.zIndex    = "100";
      input.style.cursor    = "hand";
      input.style.cursor    = "pointer";
      input.style.filter    = "alpha(opacity=0)";
      input.style.opacity   = "0";
      input.style.MozOutlinestyle = "none";
      input.style.hidefocus = "true";
      input.disabled        = this.getEnabled() === false;
      
      var bounds = this.getBounds();
      var width = bounds && bounds.width ? bounds.width : 16;
      var height = bounds && bounds.height ? bounds.height : 16;
      
      this._setInputSize(width, height);

      var _this = this;
      input.onchange = function(ev) { return _this._onChange(ev); };

      // Use wrapper. When materialized, qooxdoo adds 'input' element
      // to container.
      var inputEl = new qx.html.Element();
      inputEl.useElement(input);

      el.add(inputEl);
    },

    _setInputSize: function(width, height)
    {
      var input = this._input;
      if (!input) return;

      input.style.clip = "rect(auto, " + (791 + width) + "px, auto, 789px)";
      //input.style.clip = "rect(0px, " + (791 + width) + "px, " + height + "px, 789px)";
      input.style.height = "" + (height * 2) + "px";
    },

    _onuploadresize: function(e)
    {
      var data = e.getData();
      this._setInputSize(data.width, data.height);
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
      this.setFieldValue(this._input.value);
    }
  }
});