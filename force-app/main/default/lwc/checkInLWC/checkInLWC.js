/* eslint-disable no-console */
import { LightningElement, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import USER_ID from "@salesforce/user/Id";
import getServiceResourceByUserId from "@salesforce/apex/CheckInController.getServiceResourceByUserId";
import updateWorkOrderById from "@salesforce/apex/CheckInController.updateWorkOrderById";
export default class CheckInLWC extends LightningElement {
  @track title = "Check-in";
  @track serviceResourceName;
  @track accept = "image/png, image/jpg, image/jpeg";
  @track loaded = false;
  @track disabled = true;
  @track disableCheckIn = true;
  @track observations;
  @track userLatitude;
  @track userLongitude;
  @api recordId;

  onObservationsChange(event) {
    this.observations = event.target.value;
  }

  showToast(title, message, variant) {
    const event = new ShowToastEvent({ title, message, variant });
    this.dispatchEvent(event);
  }

  errorCheckIn() {
    this.showToast(
      "Sem agente",
      "Não foi encontrado um agente com seu usuário. Favor contatar o administrador do field service",
      "error"
    );
    this.disableCheckIn = true;
    this.loaded = true;
  }

  //initialization
  connectedCallback() {
    this.fillServiceResource();
    this.fillGeolocation();
  }

  fillGeolocation() {
    //get geolocation of the device
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.userLatitude = position.coords.latitude;
        this.userLongitude = position.coords.longitude;
      });
    } else {
      this.showToast(
        "Sem GPS",
        "O dispositivo não possui GPS, favor tentar em outro dispositivo",
        "error"
      );
      this.disableCheckIn = true;
    }
  }

  fillServiceResource() {
    getServiceResourceByUserId({
      userId: USER_ID
    })
      .then(result => {
        if (result != null) {
          this.disableCheckIn = false;
          this.serviceResourceName = result.Name;

          this.loaded = true;
        } else {
          this.errorCheckIn();
        }
      })
      .catch(error => {
        console.log(error);
        this.errorCheckIn();
      });
  }

  handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;
    if (uploadedFiles) {
      this.showToast("Sucesso", "Arquivo anexado com sucesso", "success");
    } else {
      this.showToast("Erro", "Falha ao anexar arquivo", "error");
    }
  }
  handleSubmitButton(event) {
    this.loaded = false;
    this.disableCheckIn = true;

    updateWorkOrderById({
      workOrderId: this.recordId,
      latitude: this.userLatitude,
      longitude: this.userLongitude,
      observations: this.observations
    })
      .then(result => {
        console.log(result);
        if (result) {
          this.loaded = true;

          eval("$A.get('e.force:refreshView').fire();");

          this.showToast(
            "Check-in realizado!",
            "O check-in foi realizado com sucesso.",
            "success"
          );

          eval("$A.get('e.force:closeQuickAction').fire();");
        } else {
          this.showToast(
            "Houve um erro.",
            "Favor contatar o administrador do field service",
            "error"
          );
        }
      })
      .catch(error => {
        console.log(error);
        this.showToast(
          "Houve um erro.",
          "Favor contatar o administrador do field service",
          "error"
        );
      });
  }
}
