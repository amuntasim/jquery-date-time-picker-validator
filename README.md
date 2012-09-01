Attribute based jquery date(time) picker validator.

You have to define the rule in field attribute like:
<input type="text" class="date"
   data-disable-past-date="true"
   data-greater-than-field="ANOTHER FILED ID"
   data-greater-than-date="SOME DATE STRING"
   data-greater-than-eq-field="ANOTHER FILED ID"
   data-greater-than-eq-date="SOME DATE STRING"
   data-less-than-field="ANOTHER FILED ID"
   data-less-than-date="SOME DATE STRING"
   data-less-than-eq-field="ANOTHER FILED ID"
   data-less-than-eq-date="SOME DATE STRING"
   data-eq-field="ANOTHER FILED ID"
   data-eq-date="SOME DATE STRING"
   data-not-eq-field="ANOTHER FILED ID"
   data-not-eq-date="SOME DATE STRING"
   data-date-difference=1 //number of days difference you need
   

   these attributes can be set using jquery like:
   $('item').data("disable-past-date", true) etc....


   Then just call datepicker/ datetimepicker on the field like:

   $('date-fields-selector').datepicker({OPTIONS})
   or
   $('date-fields-selector').datetimepicker({OPTIONS})

   For using it in the exsisting implementation,
   $("input.date").datepicker(
       { showOn:'both',
         dateFormat:'yy-mm-dd',
         buttonImage:"/assets/calender.jpg",
         buttonImageOnly:true,
         validateBeforeShow: true          //This line needs to be added for this plugin to work
     }
   );
   
  Make sure jquery-datepicker-attrbasedvalidation.js file is included :)	

