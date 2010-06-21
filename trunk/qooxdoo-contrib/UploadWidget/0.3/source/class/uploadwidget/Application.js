/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)

************************************************************************ */

/* ************************************************************************

#asset(uploadwidget/*)
#asset(qx/icon/Tango/16/actions/document-save.png)
#asset(qx/icon/Tango/16/actions/dialog-ok.png)
#asset(qx/icon/Tango/16/actions/document-revert.png)

************************************************************************ */
/**
 * uploadWidget Example application
 */
qx.Class.define("uploadwidget.Application",
{
  extend : qx.application.Standalone,




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * Main method - application start point
     *
     * @return {void}
     */
    main : function()
    {
      this.base(arguments);
      
      // Add log appenders
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        qx.log.appender.Native;
        qx.log.appender.Console;
        if (qx.bom.client.Engine.MSHTML)
        {
          qx.log.appender.Console.init();
        }
      }
      
      var mainContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(40));      
      var container = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
      
      var lbl1Text = "<h1>UploadForm and UploadFile Implementation</h1>" +
      		           "<p>The class UploadForm creates a hidden iframe which is used as a target for the form submit.</p>" +
      		           "<p>An event of type <b>\"sending\"</b> is fired after submit. " +
      		           "On completion (iframe completed loading) a <b>\"completed\"</b> event is fired.</p>" +
      		           "<p>Upload form implements the methods getIframeTextContent, getIframeHtmlContent " +
      		           "and getIframeXmlContent to get the content of the iframe</p>" +
      		           "<p>UploadFile fires a <b>\"changeFieldValue\"</b> event after the selection through the OS fileselector is " +
      		           "completed</p>" +
      		           "<p>Multiple UploadFile instances are possible. The text field is readonly</p>";
      var label1 = new qx.ui.basic.Label(lbl1Text);
      label1.setRich(true);
      this.getRoot().add(label1, {top:10, left:20});
      
      /*
       * SINGLE UPLOAD WIDGET 
       */      
      var form = new uploadwidget.UploadForm('uploadFrm','/cgi-bin/uploadtest.pl');
      form.setParameter('rm','upload');
      form.setLayout(new qx.ui.layout.Basic);

      container.add(form);
      mainContainer.add(container);

      var file = new uploadwidget.UploadField('uploadfile', 'Upload File','icon/16/actions/document-save.png');
      form.add(file, {left:0,top:0});

      form.addListener('completed',function(e) {
        this.debug('completed');
        file.setFieldValue('');
        var response = this.getIframeHtmlContent();
        this.debug(response);
      });

      form.addListener('sending',function(e) {
        this.debug('sending');
      });

      file.addListener('changeFieldValue',function(e){
        if(e.getData()!='') {
          form.send();
        }
      });
      
      
      
      /*
       * MULTIPLE UPLOAD WIDGET 
       */
      
      var container2 = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
      
      var form2 = new uploadwidget.UploadForm('uploadFrm','/cgi-bin/uploadtest.pl');
      form2.setParameter('rm','upload_multiple');
      form2.setPadding(8);

      var vb = new qx.ui.layout.VBox(10)
      form2.setLayout(vb);
      container2.add(form2);
      
      var l = new qx.ui.basic.Label("One UploadForm, three file uploads.<br/>Please select the files and then hit the 'Upload' Button");
      l.setRich(true);
      form2.add(l);
          
      var file1 = new uploadwidget.UploadField('uploadfile1', 'Select File 1','icon/16/actions/document-save.png');
      form2.add(file1);

      var file2 = new uploadwidget.UploadField('uploadfile2', 'Select File 2','icon/16/actions/document-save.png');
      form2.add(file2);

      var file3 = new uploadwidget.UploadField('uploadfile3', 'Select File 3','icon/16/actions/document-save.png');
      form2.add(file3);

      form2.addListener('sending',function(e) {
        this.debug('sending');
      });

      var bt = new qx.ui.form.Button("Upload", "icon/16/actions/dialog-ok.png");
      bt.set({ marginTop : 10, allowGrowX : false });
      form2.add(bt);
      
      form2.addListener('completed',function(e) {
        this.debug('completed');
        file1.setFieldValue('');
        file2.setFieldValue('');
        file3.setFieldValue('');
        var response = this.getIframeHtmlContent();
        this.debug(response);
        bt.setEnabled(true);
      });

      bt.addListener('execute', function(e) {
        form2.send();
        this.setEnabled(false);
      });

      mainContainer.add(container2);
      
      
      

      /*
       * MULTIPLE UPLOAD WIDGET 2 
       */
      
      var container3 = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
      
      var form3 = new uploadwidget.UploadForm('uploadFrm','/cgi-bin/uploadtest.pl');
      form3.setParameter('rm','upload_multiple');
      form3.setPadding(8);

      form3.setLayout(new qx.ui.layout.VBox(10));
      container3.add(form3);
      
      var l3 = new qx.ui.basic.Label("One UploadForm, six file uploads.<br/>Please select the files and then hit the 'Upload' Button");
      l3.setRich(true);
      form3.add(l3);

      var file1 = new uploadwidget.UploadField('uploadfile1', 'Select File 1','icon/16/actions/document-save.png');
      form3.add(file1);

      var file2 = new uploadwidget.UploadField('uploadfile2', 'Select File 2','icon/16/actions/document-save.png');
      form3.add(file2);

      var file3 = new uploadwidget.UploadField('uploadfile3', 'Select File 3','icon/16/actions/document-save.png');
      form3.add(file3);

      var file4 = new uploadwidget.UploadField('uploadfile4', 'Select File 4','icon/16/actions/document-save.png');
      form3.add(file4);

      var file5 = new uploadwidget.UploadField('uploadfile5', 'Select File 5','icon/16/actions/document-save.png');
      form3.add(file5);

      var file6 = new uploadwidget.UploadField('uploadfile6', 'Select File 6','icon/16/actions/document-save.png');
      form3.add(file6);

      form3.addListener('sending',function(e) {
        this.debug('sending');
      });

      var bt = new qx.ui.form.Button("Upload", "icon/16/actions/dialog-ok.png");
      bt.set({ marginTop : 10, width : 100, allowGrowX : false });
      form3.add(bt);
      
      form3.addListener('completed',function(e) {
        this.debug('completed');
        file1.setFieldValue('');
        file2.setFieldValue('');
        file3.setFieldValue('');
        file4.setFieldValue('');
        file5.setFieldValue('');
        file6.setFieldValue('');
        var response = this.getIframeHtmlContent();
        this.debug(response);
        bt.setEnabled(true);
      });

      bt.addListener('execute', function(e) {
        form3.send();
        this.setEnabled(false);
      });
      
      var resetButton = new qx.ui.form.Button("Reset", "icon/16/actions/document-revert.png");
      resetButton.set({ width: 100, allowGrowX: false });
      resetButton.addListener("execute", function(e) {
        file1.setFieldValue("");
      }, this);
      form3.add(resetButton);
      
      mainContainer.add(container3);
      
      this.getRoot().add(mainContainer, { top:220, left: 20 });
    }
  }
  
});