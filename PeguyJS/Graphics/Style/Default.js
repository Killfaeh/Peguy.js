(function(global)
{
	//// General ////

	STYLE.textColor = 'rgb(0, 0, 0)';

	STYLE.background0 = 'rgb(255, 255, 255)';
	STYLE.background1 = 'rgb(20, 20, 20)';
	STYLE.background2 = 'rgb(40, 40, 40)';
	STYLE.background3 = 'rgb(60, 60, 60)';
	STYLE.background4 = 'rgb(80, 80, 80)';
	STYLE.background5 = 'rgb(100, 100, 100)';
	STYLE.backgroundColor = STYLE.background0;

	STYLE.borderColor = 'rgb(200, 200, 200)';
	STYLE.border = 'solid 1px ' + STYLE.borderColor;
	STYLE.iconsColor = 'rgb(34, 145, 167)';

	STYLE.buttonsBackgroundColor = 'rgb(34, 145, 167)';
	STYLE.buttonsBorderColor = 'rgb(34, 145, 167)';
	STYLE.buttonsTextColor = 'rgb(255, 255, 255)';
	STYLE.buttonsFontWeight = 'bold';
	STYLE.buttonsBorder = 'solid 1px ' + STYLE.buttonsBorderColor;
	STYLE.buttonsBorderRadius = '5px';
	STYLE.buttonsBackgroundImage = 'none';

	STYLE.disableButtonsBackgroundColor = 'rgb(128, 128, 128)';
	STYLE.disableButtonsBorderColor = 'rgb(128, 128, 128)';
	STYLE.disableButtonsTextColor = 'rgb(255, 255, 255)';
	STYLE.disableButtonsBorder = 'solid 1px ' + STYLE.disableButtonsBorderColor;

	STYLE.inputBorderColor = 'rgb(160, 160, 160)';
	STYLE.inputFocusBorderColor = 'rgb(160, 160, 160)';
	STYLE.inputBackgroundColor = 'rgb(255, 255, 255)';
	STYLE.inputTextColor = 'rgb(0, 0, 0)';

	STYLE.linkColor = 'rgb(128, 128, 128)';

	//// FloatingPanel ////

	STYLE.floatingPanelBorder = STYLE.border;
	STYLE.floatingPanelBackgroundColor = 'rgb(255, 255, 255)';
	STYLE.floatingPanelBoxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';

	//// Accordion ////

	STYLE.accordionHeaderBackgroundColor = 'rgb(235, 235, 235)';

	//// AutoComplete ////

	STYLE.autoCompleteBorder = STYLE.border;
	STYLE.autoCompleteBackgroundColor = 'rgb(255, 255, 255)';
	STYLE.autoCompleteTruncateMask = 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 75%)';
	STYLE.autoCompleteBoxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
	STYLE.autoCompleteSeletedBackgroundColor = 'rgb(200, 200, 200)';

	//// Calendrier ////

	STYLE.calendarHoverBorder = STYLE.border;
	STYLE.calendarHoverBackgroundColor = 'rgb(250, 250, 250)';
	STYLE.calendarArrowsColor = STYLE.iconsColor;
	STYLE.calendarWeekendColor = 'rgb(100, 100, 100)';
	STYLE.calendarWeekendBackgroundColor = 'rgb(225, 225, 225)';
	STYLE.calendarOtherMonthColor = 'rgb(128, 128, 128)';
	STYLE.calendarTodayColor = 'rgb(255, 255, 255)';
	STYLE.calendarTodayBackgroundColor = STYLE.buttonsBackgroundColor;
	STYLE.calendarSelectedColor = 'rgb(255, 255, 255)';
	STYLE.calendarSelectedBackgroundColor = STYLE.iconsColor;

	//// ComboBox ////

	STYLE.comboBoxBorder = STYLE.border;
	STYLE.comboBoxBackgroundColor = 'rgb(255, 255, 255)';
	STYLE.comboBoxBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
	STYLE.comboBoxSeletedBackgroundColor = 'rgba(255, 255, 255, 0.2)';
	
	//// ColorPalette ////
	
	STYLE.colorPaletteBorder = STYLE.borderColor;
	STYLE.colorPaletteBorderRadius = '3px';
	STYLE.colorPaletteBoxShadow = '2px 2px 3px rgba(0, 0, 0, 0.4)';

	//// Frame ////

	STYLE.frameScreenColor = 'rgba(0, 0, 0, 0.8)';
	STYLE.frameBorder = 'solid 2px ' + STYLE.borderColor;
	STYLE.frameBorderRadius = '5px';
	STYLE.frameBackGroundColor = 'rgb(60, 60, 60)';
	STYLE.frameBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
	STYLE.innerFrameBorder = 'solid 1px ' + STYLE.borderColor;
	STYLE.frameBgTitleDisplay = 'none';
	
	//// Blurred frame ////

	STYLE.blurFrameBorder = 'solid 2px rgb(70, 70, 70)';
	STYLE.blurFrameBackgroundColor = 'rgb(40, 40, 40)';
	STYLE.blurFrameBoxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
	STYLE.blurFrameTitleColor = 'rgb(200, 200, 200)';
	STYLE.blurFrameContentBorder = 'solid 1px rgb(240, 240, 240) !important';

	//// Check box ////

	STYLE.checkBoxBackGroundColor = 'rgb(255, 255, 255)';
	STYLE.checkBoxBorder = '1px rgb(162, 160, 160) solid';

	//// Freeze screen ////

	STYLE.popupFreezeScreenColor = 'rgba(255, 255, 255, 0.8)';

	//// Popup ////

	STYLE.popupScreenColor = 'rgba(0, 0, 0, 0.8)';
	STYLE.popupBorder = 'solid 2px ' + STYLE.borderColor;
	STYLE.popupBorderRadius = '5px';
	STYLE.popupBackGroundColor = 'rgb(60, 60, 60)';
	STYLE.popupBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
	
	//// Image popup ////
	
	STYLE.imagePopupBackgroundColor = 'rgba(0, 0, 0, 0.9)';
	STYLE.imagePopupBorder = 'solid 1px ' + STYLE.borderColor;
	STYLE.imagePopupBorderRadius = '5px';
	STYLE.imagePopupBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
	
	//// Select ////
	
	STYLE.selectBorder = '1px rgb(162, 160, 160) solid';
	STYLE.selectBackgroundColor = 'rgb(255, 255, 255)';
	
	/*
STYLE.accordionBackgroundColor = 'rgb(100, 100, 100)';
STYLE.autoCompleteBackgroundImage = 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 75%)';
STYLE.autoCompleteBorder = 'solid 2px rgb(120, 120, 120)';
STYLE.autoCompleteBackgroundColor = 'rgb(60, 60, 60)';
STYLE.autoCompleteBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
STYLE.buttonColor = 'rgb(0, 0, 0)';
STYLE.buttonBackgroundColor = 'rgb(242, 98, 33)';
STYLE.buttonBackgroundImage = 'none';
STYLE.buttonBorder = 'solid rgb(242, 98, 33) 2px';

STYLE.calendarBorder = 'solid 1px rgb(120, 120, 120)';
STYLE.calendarBackgroundColor = 'rgb(60, 60, 60)';
STYLE.calendarBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
STYLE.calendarColor = 'rgb(251, 190, 0)';
STYLE.checkBoxBorder = '1px rgb(162, 160, 160) solid';
STYLE.checkBoxBackgroundColor = 'rgb(255, 255, 255)';

STYLE.codeEditorBackgroundColor = 'rgb(40, 40, 40)';
STYLE.codeEditorColor = 'rgb(200, 200, 200)';
STYLE.codeEditorBorder = 'none';
STYLE.codeEditorBorderTop = '1px solid rgb(128, 128, 128)';
STYLE.codeEditorBackground = 'rgb(128, 128, 128)';
STYLE.codeEditorCaretColor = 'rgb(200, 200, 200)';
STYLE.codeEditorBorderRight = '1px solid rgb(128, 128, 128)';
STYLE.codeEditorBorderBottom = '1px dotted rgb(120, 120, 120)';
STYLE.colorPaletteBorder = 'dotted 1px rgb(0, 0, 0)';
STYLE.colorPaletteBoxShadow = '2px 2px 3px rgba(0, 0, 0, 0.4)';

STYLE.comboBoxBorder = 'solid 2px rgb(120, 120, 120)';
STYLE.comboBoxBackgroundColor = 'rgb(60, 60, 60)';
STYLE.comboBoxBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
STYLE.consoleFrameBorder = 'solid 2px rgb(120, 120, 120)';
STYLE.consoleFrameBackgroundColor = 'rgb(40, 40, 40)';
STYLE.consoleFrameBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
STYLE.contextMenuBorder = 'solid 2px rgb(120, 120, 120)';
STYLE.contextMenuBackgroundColor = 'rgb(60, 60, 60)';
STYLE.contextMenuBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
STYLE.contextMenuColor = 'rgb(251, 190, 0)';
STYLE.contextPaletteBorder = 'solid 1px rgb(100, 100, 100)';
STYLE.contextPaletteBackgroundColor = 'rgb(0, 0, 0)';
STYLE.contextPaletteBoxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
STYLE.contextPaletteBorderLeft = 'solid 1px rgb(150, 150, 150)';
STYLE.contextPaletteBorderTop = 'solid 1px rgb(150, 150, 150)';
STYLE.contextPaletteBorderRight = 'solid 1px rgb(255, 255, 255)';
STYLE.contextPaletteBorderBottom = 'solid 1px rgb(255, 255, 255)';
STYLE.contextPanelBorder = 'solid 1px rgb(100, 100, 100)';
STYLE.contextPanelBackgroundColor = 'rgb(0, 0, 0)';
STYLE.contextPanelBoxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
STYLE.desktopBorder = '2px solid rgba(128, 128, 128, 0.6)';
STYLE.desktopBackgroundColor = 'rgba(128, 128, 128, 0.3)';
STYLE.desktopColor = 'rgb(255, 255, 255)';
STYLE.dockBackgroundColor = 'rgba(255, 255, 255, 0.5)';
STYLE.dockColor = 'rgb(30, 30, 30)';
STYLE.dockBoxShadow = '0px 2px 3px rgba(0, 0, 0, 0.1)';
STYLE.dropFilesZoneBorder = 'dashed 1px rgb(150, 150, 150)';
STYLE.dropFilesZoneBackgroundColor = 'rgb(80, 80, 80)';
STYLE.dropFilesZoneBoxShadow = '2px 2px 3px rgba(0, 0, 0, 0.4)';
STYLE.editCommandsBarBackgroundColor = '#e6e6e6';
STYLE.fileSystemBorderRight = 'solid 1px rgb(120, 120, 120)';
STYLE.fileSystemColor = 'rgb(251, 190, 0)';
STYLE.fileSystemBackgroundColor = 'rgb(58, 195, 255)';
STYLE.fileSystemBoxShadow = '-3px -3px 1px rgb(120, 120, 120) inset,inset 3px 3px 1px rgb(120, 120, 120)';


STYLE.formPanelBackgroundColor = 'rgba(255, 255, 255, 0.1)';
STYLE.formPanelBorder = 'solid 1px rgb(120, 120, 120)';
STYLE.frameBorder = 'solid 2px rgb(120, 120, 120)';
STYLE.frameBackgroundColor = 'rgb(60, 60, 60)';
STYLE.frameBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
STYLE.frameColor = 'rgb(100, 100, 100)';

STYLE.horizontalSlideBorder = '1px solid rgb(120, 120, 120)';
STYLE.horizontalSlideBoxShadow = 'inset -1px -1px 2px rgba(255, 255, 255, 0.2)';
STYLE.iDIconBackgroundColor = 'rgb(242, 98, 33)';
STYLE.iDIconColor = 'rgb(0, 0, 0)';

STYLE.imagePopupBackgroundColor = 'rgba(255, 255, 255, 0.9)';
STYLE.imagePopupBorder = 'solid 1px rgba(0, 0, 0, 0.2)';
STYLE.imagePopupBoxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
STYLE.imagesManagerBorder = 'solid 1px rgb(128, 128, 128)';
STYLE.imagesManagerBackgroundColor = 'rgb(255, 255, 255)';
STYLE.imagesManagerBoxShadow = 'inset 1px 1px 5px rgba(0, 0, 0, 0.2)';
STYLE.inputFileColor = 'rgb(0, 0, 0)';
STYLE.inputFileBackgroundColor = 'rgb(58, 195, 255)';
STYLE.inputFileBackgroundImage = 'none';
STYLE.inputFileBorder = 'solid rgb(58, 195, 255) 2px';


STYLE.labelListBorder = '1px rgb(120, 120, 120) solid';
STYLE.labelListBackgroundColor = 'rgb(100, 100, 100)';
STYLE.labelListColor = 'rgb(200, 200, 200)';
STYLE.listBoxBorderBottom = 'solid 1px rgb(120, 120, 120)';
STYLE.listBoxColor = 'rgba(251, 190, 0, 0.0)';
STYLE.listBoxBorder = 'none';
STYLE.listBoxBackgroundColor = 'rgba(251, 190, 0, 0.3)';
STYLE.menuBarBorderBottom = 'solid 1px rgb(0, 0, 0)';
STYLE.menuBarBackgroundColor = 'rgb(65, 65, 65)';
STYLE.menuBarBackgroundImage = '-webkit-linear-gradient(top, rgb(30, 30, 30) 10%, rgb(65, 65, 65) 45%, rgb(0, 0, 0) 50%, rgb(35, 35, 35) 100%)';
STYLE.menuBarBoxShadow = '0px 2px 5px rgba(0, 0, 0, 0.8)';
STYLE.menuBarColor = 'rgb(128, 128, 128)';
STYLE.menuBarBorder = 'solid 2px rgb(120, 120, 120)';
STYLE.notificationsManagerBorder = 'solid 2px rgb(120, 120, 120)';
STYLE.notificationsManagerBackgroundColor = 'rgb(60, 60, 60)';
STYLE.notificationsManagerBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
STYLE.peguyHelpFrameBackgroundColor = 'rgb(60, 60, 60)';
STYLE.peguyHelpFrameBoxShadow = 'inset 1px 1px 5px rgba(0, 0, 0, 0.4)';
STYLE.peguyHelpFrameBorder = '1px solid rgb(128, 128, 128)';
STYLE.peguyHelpFrameColor = 'rgb(240, 240, 240)';
STYLE.peguyIconsQuickCodePanelBackgroundColor = 'rgb(40, 40, 40)';
STYLE.popupBackgroundColor = 'rgba(0, 0, 0, 0.8)';
STYLE.popupBorder = 'solid 2px rgb(120, 120, 120)';
STYLE.popupBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
STYLE.progressBarBorder = 'solid 2px rgb(120, 120, 120)';
STYLE.progressBarBackgroundColor = 'rgb(60, 60, 60)';
STYLE.quickCodePanelBackgroundColor = 'rgb(40, 40, 40)';

STYLE.scrollPanelBorderRight = 'solid 1px rgb(120, 120, 120)';
STYLE.scrollPanelBorderBottom = 'solid 1px rgb(120, 120, 120)';
STYLE.scrollPanelBackgroundColor = 'rgb(40, 40, 40)';
STYLE.scrollPanelBorder = 'solid 1px rgb(120, 120, 120)';
STYLE.scrollPanelBorderTop = 'solid 1px rgb(120, 120, 120)';
STYLE.scrollPanelBorderLeft = 'solid 1px rgb(120, 120, 120)';
STYLE.selectBorder = '1px rgb(162, 160, 160) solid';
STYLE.selectBackgroundColor = 'rgb(255, 255, 255)';
STYLE.selectColorPopupBorder = '1px solid rgb(0, 0, 0)';
STYLE.sliderBackgroundColor = 'rgb(235, 235, 235)';
STYLE.switchBackgroundColor = 'rgb(235, 235, 235)';
STYLE.tabManagerBackgroundColor = 'rgb(60, 60, 60)';
STYLE.tabManagerBorderBottom = 'solid 1px rgb(120, 120, 120)';
STYLE.tabManagerBorderRight = 'solid 1px rgb(120, 120, 120)';
STYLE.tabManagerBorderTop = 'solid 1px rgb(120, 120, 120)';
STYLE.tabManagerBackgroundImage = '-webkit-linear-gradient(top, rgb(90, 90, 90) 0%, rgb(60, 60, 60) 100%)';
STYLE.tabManagerColor = 'rgb(200, 200, 200)';
STYLE.tabManagerBorderLeft = 'solid 1px rgb(150, 150, 150)';
STYLE.tabManagerBorder = 'solid 2px rgb(120, 120, 120)';
STYLE.tabManagerBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
STYLE.testCodePanelBorder = 'solid 1px rgb(120, 120, 120)';
STYLE.testCodePanelColor = '#d1242e';
STYLE.toolTipBorder = 'solid 1px rgb(120, 120, 120)';
STYLE.toolTipBackgroundColor = 'rgb(60, 60, 60)';
STYLE.toolTipBoxShadow = '3px 4px 5px rgba(0, 0, 0, 0.9)';
STYLE.toolsBarBackgroundColor = 'rgba(255, 255, 255, 0.2)';
STYLE.treeBackgroundColor = 'rgb(80, 80, 80)';
STYLE.treeColor = 'rgb(251, 190, 0)';
STYLE.treeBorder = '1px solid rgb(120, 120, 120)';
STYLE.verticalSlideBorder = '1px solid rgb(120, 120, 120)';
STYLE.verticalSlideBoxShadow = 'inset -1px -1px 2px rgba(255, 255, 255, 0.2)';

	//*/

})();