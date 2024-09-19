sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/suite/ui/generic/template/extensionAPI/extensionAPI",
	],
	function (Controller, JSONModel, ExtensionAPI) {
		"use strict";

		return Controller.extend("fsm.connector.activity.ext.ActivityRelated", {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf fsm.connector.activity.ext.ActivityRelated
			 */
			onInit: function (oEvent) {
				ExtensionAPI.getExtensionAPIPromise(this.getView()).then(
					function (oExtensionAPI) {
						oExtensionAPI.attachPageDataLoaded(
							function (event) {
								this._onRouteMatched(event);
							}.bind(this)
						);
					}.bind(this)
				);
			},

			_onRouteMatched: function (oEvent) {
				let oJsonModel = new JSONModel();
				var oModel = this.getOwnerComponent().getModel();
				var sPath = oEvent.context.sPath;
				var oData = oEvent.context.getModel().getProperty(sPath);
				if (
					oData.ActivityNumber !== "" &&
					oData.OrderNumber !== "" &&
					oData.OperationNumber !== ""
				) {
					oModel.read(
						"/ActivityRelatedInf(ActivityNumber='" +
							oData.ActivityNumber +
							"',OrderNumber='" +
							oData.OrderNumber +
							"',OperationNumber='" +
							oData.OperationNumber +
							"')/to_Tree",
						{
							urlParameters: {
								$expand: "to_Tree",
							},
							success: function (oData, oResponse) {
								console.log(oData);
								oJsonModel.setData(oData.results);
								bindOrderModel();
							},
							error: function (oError) {
								console.log(oError);
							},
						}
					);
				} else {
					oJsonModel.setData({});
					this.getView().setModel(oJsonModel, "ActivityRelated");
				}

				const bindOrderModel = () => {
					this.getView().setModel(oJsonModel, "ActivityRelated");
				};
			},
			onExit: function () {
				// this.getView().getModel(oJsonModel, "ActivityRelated");
			},
		});
	}
);
