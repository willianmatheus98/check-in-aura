/**
 * @File Name          : CheckInControllerTest.cls
 * @Description        :
 * @Author             : wbatista@moldsoft.com.br
 * @Group              :
 * @Last Modified By   : wbatista@moldsoft.com.br
 * @Last Modified On   : 26/11/2019 10:20:06
 * @Modification Log   :
 * Ver       Date            Author                  Modification
 * 1.0    25/11/2019   wbatista@moldsoft.com.br     Initial Version
 **/
@ IsTest
private with sharing class CheckInControllerTest {

	@IsTest
	static void testGetServiceResourceByUserId() {
		String NAME_RESOURCE = 'Test User';
		String userId = UserInfo.getUserId();

		ServiceResource noServiceResource = CheckInController.getServiceResourceByUserId(userId);

		System.assertEquals(null, noServiceResource);

		ServiceResource srToInsert = new ServiceResource();
		srToInsert.IsActive = true;
		srToInsert.Name = NAME_RESOURCE;
		srToInsert.RelatedRecordId = UserInfo.getUserId();

		insert srToInsert;

		ServiceResource foundServiceResource = CheckInController.getServiceResourceByUserId(userId);

		System.assertEquals(NAME_RESOURCE, foundServiceResource.Name);


	}

	@IsTest
	static void testUpdateWorkOrderById() {

		String OBSERVATIONS = 'TEST OBSERVATIONS';
		String STATUS_IN_PROGRESS = 'In Progress';
		Decimal LATITUDE = 3.7;
		Decimal LONGITUDE = 7.10;

		WorkOrder noWorkOrderFound = CheckInController.updateWorkOrderById(null, LATITUDE, LONGITUDE, OBSERVATIONS);

		System.assertEquals(null, noWorkOrderFound);

		WorkOrder w = new WorkOrder();

		insert w;

		WorkOrder workUpdatedByCheckin = CheckInController.updateWorkOrderById(w.Id, LATITUDE, LONGITUDE, OBSERVATIONS);

		System.assertEquals(OBSERVATIONS, workUpdatedByCheckin.Observacoes__c);
		System.assertEquals(LATITUDE, workUpdatedByCheckin.Localizacao__Latitude__s);
		System.assertEquals(LONGITUDE, workUpdatedByCheckin.Localizacao__Longitude__s);
		System.assertEquals(STATUS_IN_PROGRESS, workUpdatedByCheckin.Status);

	}
}