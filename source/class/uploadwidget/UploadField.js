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
 * UploadField: A textfield which holds the filename of the file which
 * should be uploaded and a button which allows selecting the file via the native
 * file selector 
 *
 */
qx.Class.define("uploadwidget.UploadField",
{
  extend : qx.ui.container.Composite,

  // --------------------------------------------------------------------------
  // [Constructor]
  // --------------------------------------------------------------------------

  construct : function(fieldName, label, icon)
  {
    this.base(arguments);

    this.setLayout(new qx.ui.layout.HBox().set({spacing: 2}))

    if (fieldName) this.setFieldName(fieldName);

    this._textfield = new qx.ui.form.TextField();
    this._textfield.setReadOnly(true);

    this._button = new uploadwidget.UploadButton(this.getFieldName(), label, icon);
    this._button.addListener("changeFieldValue", this._onChangeFieldValue, this);

    this.add(this._textfield, {flex: 1});
    this.add(this._button);
  },

  // --------------------------------------------------------------------------
  // [Destructor]
  // --------------------------------------------------------------------------

  destruct : function()
  {
    this._disposeObjects("_button", "_textfield");
  },

  // --------------------------------------------------------------------------
  // [Properties]
  // --------------------------------------------------------------------------

  properties :
  {
    /**
     * The name which is assigned to the form
     */
    fieldName :
    {
      check : "String",
      init  : "",
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
    // ------------------------------------------------------------------------
    // [Instance Variables]
    // ------------------------------------------------------------------------

    _value : "",

    // ------------------------------------------------------------------------
    // [Modifiers]
    // ------------------------------------------------------------------------
    
    /**
     * Value modifier. Sets the value of both the text field and
     * the UploadButton. The setValue modifier of UploadButton
     * throws an exception if the value is not an empty string.
     *
     * @type member
     * @param value {var} Current value
     * @param old {var} Previous value
     */
    _applyFieldValue : function(value, old)
    {
      this._button.setFieldValue(value);
      this._textfield.setValue(value);
    },


    /**
     * Upload parameter value modifier. Sets the name attribute of the
     * the hidden input type=file element in UploadButton which should.
     * This name is the form submission parameter name.
     *
     * @type member
     * @param value {var} Current value
     * @param old {var} Previous value
     */
    _applyFieldName : function(value, old)
    {
      if (this._button) this._button.setFieldName(value);
    },

    // ------------------------------------------------------------------------
    // [Setters / Getters]
    // ------------------------------------------------------------------------
   
    /**
     * Returns component text field widget.
     */
    getTextField: function()
    {
      return this._textfield;
    },

    /**
     * Returns component button widget.
     */
    getButton: function()
    {
      return this._button;
    },
    
    // ------------------------------------------------------------------------
    // [Event Handlers]
    // ------------------------------------------------------------------------
    
    /**
     * If the user select a file by clicking the button, the value of
     * the input type=file tag of the UploadButton changes and
     * the text field is set with the value of the selected filename.
     *
     * @type member
     * @param e {Event} change value event data
     * @return {void}
     */
    _onChangeFieldValue : function(e)
    {
      var value = e.getData();
      this._textfield.setValue(value);
      this.setFieldValue(value);
    }
  }
});