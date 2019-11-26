/**
 * @File Name          : CheckInController.cls
 * @Description        :
 * @Author             : wbatista@moldsoft.com.br
 * @Group              :
 * @Last Modified By   : wbatista@moldsoft.com.br
 * @Last Modified On   : 25/11/2019 16:29:05
 * @Modification Log   :
 * Ver       Date            Author                  Modification
 * 1.0    25/11/2019   wbatista@moldsoft.com.br     Initial Version
 **/
public with sharing class CheckInController {

	@AuraEnabled
	public static ServiceResource getServiceResourceByUserId(String userId) {

		List<ServiceResource> resources =
		      [SELECT
		      Id, 
		      Name
		      FROM ServiceResource
		      WHERE RelatedRecordId = :userId
		      AND IsActive = true];

		if(resources.size() > 0) {
			return resources [0];
		} else {
			return null;
		}

	}

	@AuraEnabled
	public static WorkOrder updateWorkOrderById(String workOrderId, Decimal latitude, Decimal longitude, String observations) {

		String STATUS_IN_PROGRESS = 'In Progress';

		List<WorkOrder> workOrder =
		   [SELECT
		   Id, 
		   Status, 
		   Localizacao__Latitude__s, 
		   Localizacao__Longitude__s, 
		   StartDate, 
		   Observacoes__c
		   FROM WorkOrder
		   WHERE ID = :workOrderId];

		if(workOrder.size() > 0) {
			workOrder[0].StartDate = System.now();
			workOrder[0].Localizacao__Latitude__s = latitude;
			workOrder[0].Localizacao__Longitude__s = longitude;
			workOrder[0].Status = STATUS_IN_PROGRESS;
			workOrder[0].Observacoes__c = observations;

			update workOrder [0];

			return workOrder [0];
		} else {
			return null;
		}



	}
}