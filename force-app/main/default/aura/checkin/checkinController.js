({
  doInit: function(component, event, helper) {
    // get id from current user
    var userId = $A.get("$SObjectType.CurrentUser.Id");

    //method from controller apex
    var action = component.get("c.getServiceResourceByUserId");
    action.setParams({
      userId: userId
    });

    //callback for the method
    action.setCallback(this, function(response) {
      var state = response.getState();

      //verify success
      if (component.isValid() && state == "SUCCESS") {
        var serviceResource = response.getReturnValue();
        // console.log(serviceResource);

        if (serviceResource != null) {
          //enable button to checkin
          component.set("v.enableCheckIn", true);

          //fill input of the serviceResource name
          component.set("v.serviceResourceName", serviceResource.Name);
        } else {
          helper.showToast(
            "Sem agente",
            "Não foi encontrado um agente com seu usuário. Favor contatar o administrador do field service",
            "error"
          );
        }
      } else {
        console.log(response);
        console.log(state);
      }

      component.set("v.loaded", true);
    });

    $A.enqueueAction(action);

    //get geolocation of the device
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success);
      // console.log(navigator.geolocation);
      function success(position) {
        var lat = position.coords.latitude;
        component.set("v.userLatitude", lat);
        var long = position.coords.longitude;
        component.set("v.userLongitude", long);
      }
    } else {
      helper.showToast(
        "Sem GPS",
        "O dispositivo não possui GPS, favor tentar em outro dispositivo",
        "error"
      );
    }
  },
  handleUploadFinished: function(component, event, helper) {
    // This will contain the List of File uploaded data and status
    var uploadedFiles = event.getParam("files");

    if (uploadedFiles) {
      helper.showToast("Sucesso", "Arquivo anexado com sucesso", "success");
    }

    // $A.get("e.lightning:openFiles").fire({
    //   recordIds: [documentId]
    // });
  },
  handleSubmitButton: function(component, event, helper) {
    //disable button
    component.set("v.enableCheckIn", false);
    component.set("v.loaded", false);

    var observacoes = component.find("observacoesInput").get("v.value");
    var latitude = component.get("v.userLatitude");
    var longitude = component.get("v.userLongitude");
    var workOrderId = component.get("v.recordId");

    //method from controller apex
    var action = component.get("c.updateWorkOrderById");

    //params of the method
    action.setParams({
      workOrderId: workOrderId,
      latitude: latitude,
      longitude: longitude,
      observations: observacoes
    });

    //callback for the method
    action.setCallback(this, function(response) {
      var state = response.getState();

      //verify success
      if (component.isValid() && state == "SUCCESS") {
        var workOrder = response.getReturnValue();
        console.log(workOrder);

        if (workOrder != null) {
          component.set("v.enableCheckIn", true);

          //refresh the view of the record
          $A.get("e.force:refreshView").fire();

          helper.showToast(
            "Check-in realizado!",
            "O check-in foi realizado com sucesso.",
            "success"
          );

          //close the modal
          $A.get("e.force:closeQuickAction").fire();
        } else {
          helper.showToast(
            "Houve um erro.",
            "Favor contatar o administrador do field service",
            "error"
          );
        }
      } else {
        // console.log(response);
        // console.log("Failed with state: " + state);
      }

      component.set("v.loaded", true);
    });

    $A.enqueueAction(action);
  }
});
