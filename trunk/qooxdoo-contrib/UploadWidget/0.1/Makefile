################################################################################
#
#   qooxdoo - the new era of web development
#
#   http://qooxdoo.org
#
#   Copyright:
#     2007 Visionet GmbH, http://www.visionet.de
#
#   License:
#     LGPL: http://www.gnu.org/licenses/lgpl.html
#     EPL: http://www.eclipse.org/org/documents/epl-v10.php
#     See the LICENSE file in the project's top-level directory for details.
#
#   Authors:
#     * Dietrich Streifert (level420)
#
################################################################################


################################################################################
# SETTINGS
################################################################################

#
# Path to the folder of your qooxdoo distribution.
# Can either be
# a) a relative path to the location of this Makefile (preferred) or
# b) an absolute path starting at the root of your file system
# Example: If you put the skeleton folder next to the qooxdoo SDK folder,
# you can use the following relative path:
# QOOXDOO_PATH = ../../qooxdoo-0.7-sdk
# Please note that Windows users should always use relative paths.
# It should end with the last directory. Please omit a trailing slash.
#
QOOXDOO_PATH = ../../qooxdoo/qooxdoo-0.7-sdk
QOOXDOO_URI = ../../$(QOOXDOO_PATH)

#
# Namespace of your application e.g. custom
# Even complexer stuff is possible like: net.sf.custom
#
APPLICATION_NAMESPACE = uploadwidget

#
# Files that will be copied from the source directory into the build
# directory (space separated list). The default list is empty.
#
APPLICATION_FILES = index.html demo
APPLICATION_COMPLETE_BUILD = true
APPLICATION_HTML_TO_ROOT_URI = ..

#-------------------------------------------------------------------------------
# For a full list and description of available application settings, please 
# see the APPLICATION variables in file 
# $(QOOXDOO_PATH)/frontend/framework/tool/make/application.mk
# Add any of those variables for your custom configuration here:
#-------------------------------------------------------------------------------




################################################################################
# INTERNALS (PLEASE DO NOT CHANGE)
################################################################################

ifneq ($(QOOXDOO_PATH),PLEASE_DEFINE_QOOXDOO_PATH)
	include $(QOOXDOO_PATH)/frontend/framework/tool/make/targets.mk
	include $(QOOXDOO_PATH)/frontend/framework/tool/make/application.mk
endif

error:
	@echo "  * Please configure QOOXDOO_PATH"
