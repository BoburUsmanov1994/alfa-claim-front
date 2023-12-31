import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import DatePicker from "react-datepicker";
import Label from "../../../../components/ui/label";
import {get, isEmpty, isFunction, isNil} from "lodash";
import {ErrorMessage} from "@hookform/error-message";
import {Calendar} from "react-feather";
import dayjs from "dayjs";
import ru from "date-fns/locale/ru"
import "react-datepicker/dist/react-datepicker.css";

const Styled = styled.div`

  .custom-datepicker {
    display: block;
    min-width: 275px;
    width: 100%;
    padding: 12px 32px 12px 18px;
    color: #000;
    font-size: 16px;
    border: 1px solid #BABABA;
    border-radius: 5px;
    outline: none;
    max-width: 400px;
    font-family: 'Gilroy-Regular', sans-serif;

  }

  .custom__box {
    position: ${({showTime}) => showTime ? 'static' : 'relative'};
    max-width: 400px;

    .custom__icon {
      position: absolute;
      right: ${({showTime}) => showTime ? '24px' : '8px'};;
      top: 10px;
    }

  }
`;

const CustomDatepicker = ({
                              Controller,
                              control,
                              register,
                              disabled = false,
                              name,
                              errors,
                              params,
                              property,
                              defaultValue,
                              getValues,
                              watch,
                              label,
                              setValue,
                              getValueFromField = () => {
                              },
                              dateFormat = "YYYY-MM-DD",
                              ...rest
                          }) => {
    const [startDate, setStartDate] = useState(new Date());

    useEffect(() => {
        if(startDate=="Invalid Date" || startDate == null){
            setValue(name, null)
        }else{
            setValue(name, dayjs(startDate).format(dateFormat))
        }

        if (get(property, 'onChange') && isFunction(get(property, 'onChange'))) {
            get(property, 'onChange')(startDate)
        }
    }, [startDate])

    useEffect(() => {
        if (defaultValue) {
            if (dayjs(defaultValue).isValid()) {
                setStartDate(dayjs(defaultValue).toDate())
            }
        }
    }, [defaultValue])

    useEffect(() => {
        getValueFromField(getValues(name), name);
    }, [watch(name)]);
    return (
        <Styled showTime={get(property, 'showTimeSelect')} {...rest}>
            <div className="form-group">
                {!get(property, 'hideLabel', false) && <Label>{label ?? name}</Label>}
                <div className={"custom__box"}>
                    <DatePicker
                        locale={ru}
                        calendarStartDay={1}
                        dateFormat={get(property, 'dateFormat', 'dd.MM.yyyy')}
                        className={`custom-datepicker ${!isEmpty(errors) ? "error" : ''}`}
                        selected={!isNil(startDate) ? dayjs(startDate).toDate() : null}
                        onChange={(date) => {
                            if (dayjs(date).isValid()) {
                                setStartDate(date)
                            }else if(date == null){
                                setStartDate(null)
                            }else {
                                setStartDate(null)
                            }
                        }}
                        showTimeSelect={get(property, 'showTimeSelect')}
                        readOnly={disabled}
                    />
                    <Calendar className={'custom__icon'}/>
                </div>
                <ErrorMessage
                    errors={errors}
                    name={name}
                    render={({messages = `${label} is required`}) => {

                        if (errors[name]?.type == 'required') {
                            messages = `${label} is required`;
                        }
                        if (errors[name]?.type == 'pattern') {
                            messages = `${label} is not valid`;
                        }
                        if (errors[name]?.type == 'manual') {
                            messages = `${label} ${errors[name].message}`;
                        }
                        return <small className="form-error-message"> {messages}</small>;
                    }}
                />
            </div>
        </Styled>
    );
};

export default CustomDatepicker;