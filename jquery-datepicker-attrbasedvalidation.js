/*
 * jQuery date(time)picker validation
 * By: Muntasim Ahmed [muntasim@tasawr.com]
 * Version 0.0.1
 * Last Modified: 29/08/2012
 *
 * You have to define the rule in field attribute like:
 * <input type="text" class="date"
 *    data-disable-past-date="true"
 *    data-greater-than-field="ANOTHER FILED ID"
 *    data-greater-than-date="SOME DATE STRING"
 *    data-greater-than-eq-field="ANOTHER FILED ID"
 *    data-greater-than-eq-date="SOME DATE STRING"
 *    data-less-than-field="ANOTHER FILED ID"
 *    data-less-than-date="SOME DATE STRING"
 *    data-less-than-eq-field="ANOTHER FILED ID"
 *    data-less-than-eq-date="SOME DATE STRING"
 *    data-eq-field="ANOTHER FILED ID"
 *    data-eq-date="SOME DATE STRING"
 *    data-not-eq-field="ANOTHER FILED ID"
 *    data-not-eq-date="SOME DATE STRING"
 *    />
 *
 *    these attributes can be set using jquery like:
 *    $('item').data("disable-past-date", true) etc....
 *
 *
 *    Then just call datepicker/ datetimepicker on the field like:
 *
 *    $('date-fields-selector').datepicker({OPTIONS})
 *    or
 *    $('date-fields-selector').datetimepicker({OPTIONS})
 *
 *    For using it in the exsisting implementation,
 *    $("input.date").datepicker(
 *        { showOn:'both',
 *          dateFormat:'yy-mm-dd',
 *          buttonImage:"/assets/calender.jpg",
 *          buttonImageOnly:true,
 *          validateBeforeShow: true          <------------ This line needs to be added for the plugin to work
 *      }
 *    );
 *   Make sure  jquery-datepicker-attrbasedvalidation.js file is included :)
 */
(function ($) {

    $.datepicker._base_showDatepicker = $.datepicker._showDatepicker;
    $.datepicker._showDatepicker = function (input) {

        //console.debug(input);
        var input = input.target || input, inst = $.datepicker._getInst(input);
        var tp_inst = $.datepicker._get(inst, 'timepicker');

        // console.debug(tp_inst.hour);
        var dateValidationSettings = {};
        var updateValidationSettings = function (date, comparison) {
            if (!date)
                return false;

            switch (comparison) {
                case 'eq':
                    dateValidationSettings['minDate'] = date;
                    dateValidationSettings['maxDate'] = date;

                    // uncomment these lines if you need two time same
                    /*
                     if (tp_inst) {
                     dateValidationSettings['minDateTime'] = date;
                     dateValidationSettings['maxDateTime'] = date;
                     }
                     */
                    break;
                case 'ne':
                    //TBD

                    break;
                case 'gt':
                    var tmpDate = date, tmpDateTime = date;
                    if (tp_inst)
                        tmpDateTime.setMinutes(tmpDateTime.getMinutes() + 1);
                    else
                        tmpDate.setMinutes(tmpDate.getDate() + 1);

                    dateValidationSettings['minDate'] = tmpDate;
                    if (tp_inst)
                        dateValidationSettings['minDateTime'] = tmpDateTime;
                    break;
                case 'gte':
                    dateValidationSettings['minDate'] = date;
                    if (tp_inst)
                        dateValidationSettings['minDateTime'] = date;
                    break;
                case 'lt':
                    var tmpDate = date;
                    tmpDateTime = date;
                    if (tp_inst)
                        tmpDateTime.setMinutes(tmpDateTime.getMinutes() - 1);
                    else
                        tmpDate.setMinutes(tmpDate.getDate() - 1);

                    dateValidationSettings['maxDate'] = tmpDate;
                    if (tp_inst)
                        dateValidationSettings['maxDateTime'] = tmpDateTime;
                    break;
                case 'lte':
                    dateValidationSettings['maxDate'] = date;
                    if (tp_inst)
                        dateValidationSettings['maxDateTime'] = date;
                    break;

                default:
                //do nothing
            }


        };

        var parseTime = function (timeString) {
            if (timeString == '') return null;
            var d = new Date();
            var time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i);
            d.setHours(parseInt(time[1], 10) + ( ( parseInt(time[1], 10) < 12 && time[4] ) ? 12 : 0));
            d.setMinutes(parseInt(time[3], 10) || 0);
            d.setSeconds(0, 0);
            return d;
        };

        var extractDate = function (source, sourceType) {
            if (sourceType == 'date') {
                var date = $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
                    source, $.datepicker._getFormatConfig(inst));
                if (tp_inst) {
                    var time = parseTime(source.split(' ')[1]);
                    date.setHours(time.getHours());
                    date.setMinutes(time.getMinutes());
                }
                return date;
            }
            else {
                var dt;
                if ($('#' + source).is('.hasDatepicker')) {
                    dt = $('#' + source).datepicker('getDate');
                }
                else {
                    var field_val = $('#' + source).val();
                    dt = $.datepicker.parseDate($.datepicker._get(inst, 'dateFormat'),
                        field_val, $.datepicker._getFormatConfig(inst));
                                    if (tp_inst) {
                                        var time = parseTime(source.split(' ')[1]);
                                        date.setHours(time.getHours());
                                        date.setMinutes(time.getMinutes());
                                    }
                }

                return dt;
            }
        };

        var validateBeforeShow = $.datepicker._get(inst, 'validateBeforeShow');


        if (validateBeforeShow) {

            if ($(input).data('disable-past-date') == true) {
                dateValidationSettings['minDate'] = new Date()
            }

            if ($(input).data('greater-than-field')) {
                var thatDate = extractDate($(input).data('greater-than-field'), 'field')
                updateValidationSettings(thatDate, 'gt')
            }

            if ($(input).data('greater-than-date')) {
                var thatDate = extractDate($(input).data('greater-than-date'), 'date');
                updateValidationSettings(thatDate, 'gt')
            }

            if ($(input).data('greater-than-eq-field')) {
                var thatDate = extractDate($(input).data('greater-than-eq-field'), 'field')
                updateValidationSettings(thatDate, 'gte')
            }

            if ($(input).data('greater-than-eq-date')) {
                var thatDate = extractDate($(input).data('greater-than-eq-date'), 'date');
                updateValidationSettings(thatDate, 'gte')
            }

            if ($(input).data('less-than-field')) {
                var thatDate = extractDate($(input).data('less-than-field'), 'field')
                updateValidationSettings(thatDate, 'lt')
            }

            if ($(input).data('less-than-date')) {
                var thatDate = extractDate($(input).data('less-than-date'), 'date');
                updateValidationSettings(thatDate, 'lt')
            }

            if ($(input).data('less-than-eq-field')) {
                var thatDate = extractDate($(input).data('less-than-eq-field'), 'field')
                updateValidationSettings(thatDate, 'lte')
            }

            if ($(input).data('less-than-eq-date')) {
                var thatDate = extractDate($(input).data('less-than-eq-date'), 'date');
                updateValidationSettings(thatDate, 'lte')
            }

            if ($(input).data('eq-field')) {
                var thatDate = extractDate($(input).data('eq-field'), 'field')
                updateValidationSettings(thatDate, 'eq')
            }

            if ($(input).data('eq-date')) {
                var thatDate = extractDate($(input).data('eq-date'), 'date');
                updateValidationSettings(thatDate, 'eq')
            }
            if ($(input).data('not-eq-field')) {
                var thatDate = extractDate($(input).data('not-eq-field'), 'field')
                updateValidationSettings(thatDate, 'eq')
            }

            if ($(input).data('not-eq-date')) {
                var thatDate = extractDate($(input).data('not-eq-date'), 'date');
                updateValidationSettings(thatDate, 'eq')
            }

            $.extend(inst.settings, dateValidationSettings)
        }


        $.datepicker._base_showDatepicker(input);
    };

})(jQuery);