import React, {useEffect, useMemo, useState} from 'react';
import {find, get, isEqual, isNil, round, upperCase} from "lodash";
import Panel from "../../../components/panel";
import Search from "../../../components/search";
import {Col, Row} from "react-grid-system";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import Button from "../../../components/ui/button";
import Form from "../../../containers/form/form";
import Flex from "../../../components/flex";
import Field from "../../../containers/form/field";
import {useDeleteQuery, useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {getSelectOptionsListFromData} from "../../../utils";
import {OverlayLoader} from "../../../components/loader";
import {useNavigate} from "react-router-dom";
import {useStore} from "../../../store";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import Checkbox from "rc-checkbox";
import Table from "../../../components/table";
import NumberFormat from "react-number-format";
import {Eye, Trash2} from "react-feather";
import Modal from "../../../components/modal";
import CarNumber from "../../../components/car-number";

const ViewContainer = ({claimFormId = null}) => {
    const {t} = useTranslation()
    const navigate = useNavigate();
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const [vehicle, setVehicle] = useState(null)
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'Claims list', path: '/claim',
    }, {
        id: 2, title: 'Claim view', path: '/claim',
    }], [])


    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])
    const {data, isLoading} = useGetAllQuery({
        key: KEYS.view,
        url: URLS.view,
        params: {
            params: {
                claimFormId: claimFormId
            }
        },
        enabled: !!(claimFormId)
    })

    const {data: filials} = useGetAllQuery({key: KEYS.agencies, url: URLS.agencies})
    const filialList = getSelectOptionsListFromData(get(filials, `data.result`, []), 'id', 'name')

    const {data: insuranceTerms, isLoading: isLoadingInsuranceTerms} = useGetAllQuery({
        key: KEYS.insuranceTerms, url: URLS.insuranceTerms
    })
    const insuranceTermsList = getSelectOptionsListFromData(get(insuranceTerms, `data.result`, []), 'id', 'name')

    const {data: region, isLoading: isLoadingRegion} = useGetAllQuery({
        key: KEYS.regions, url: URLS.regions
    })
    const regionList = getSelectOptionsListFromData(get(region, `data.result`, []), 'id', 'name')

    const {data: genders} = useGetAllQuery({
        key: KEYS.genders, url: URLS.genders
    })
    const genderList = getSelectOptionsListFromData(get(genders, `data.result`, []), 'id', 'name')

    const {data: residentTypes} = useGetAllQuery({
        key: KEYS.residentTypes, url: URLS.residentTypes
    })
    const residentTypeList = getSelectOptionsListFromData(get(residentTypes, `data.result`, []), 'id', 'name')

    const {data: country, isLoading: isLoadingCountry} = useGetAllQuery({
        key: KEYS.countries, url: URLS.countries
    })
    const countryList = getSelectOptionsListFromData(get(country, `data.result`, []), 'id', 'name')

    const {data: areaTypes} = useGetAllQuery({
        key: KEYS.areaTypes, url: URLS.areaTypes
    })
    const areaTypesList = getSelectOptionsListFromData(get(areaTypes, `data.result`, []), 'id', 'name')

    const {data: ownershipForms} = useGetAllQuery({
        key: KEYS.ownershipForms, url: URLS.ownershipForms
    })
    const ownershipFormList = getSelectOptionsListFromData(get(ownershipForms, `data.result`, []), 'id', 'name')

    const {data: vehicleTypes} = useGetAllQuery({
        key: KEYS.vehicleTypes, url: URLS.vehicleTypes
    })
    const vehicleTypeList = getSelectOptionsListFromData(get(vehicleTypes, `data.result`, []), 'id', 'name')


    const {data: agents} = useGetAllQuery({
        key: [KEYS.agents],
        url: URLS.agents,
        params: {
            params: {
                branch: get(data, 'data.result.agencyId')
            }
        },
    })
    const agentsList = getSelectOptionsListFromData(get(agents, `data.result`, []), 'id', 'name')

    const {data: okeds} = useGetAllQuery({
        key: KEYS.okeds, url: URLS.okeds
    })
    const okedList = getSelectOptionsListFromData(get(okeds, `data.result`, []), 'id', 'name')

    const {data: district} = useGetAllQuery({
        key: [KEYS.districts],
        url: URLS.districts,
    })
    const districtList = getSelectOptionsListFromData(get(district, `data.result`, []), 'id', 'name')


    const {
        mutate: sendFond, isLoading: isLoadingFond
    } = usePostQuery({listKeyId: KEYS.osgopView})
    const {
        mutate: confirmPayedRequest, isLoading: isLoadingConfirmPayed
    } = usePostQuery({listKeyId: KEYS.osgopView})

    const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.osgopDelete})

    const send = () => {
        sendFond({
                url: `${URLS.osgopSendFond}?claimFormId=${claimFormId}`, attributes: {}
            },
            {
                onSuccess: ({data}) => {

                }
            }
        )
    }

    const confirmPayed = () => {
        confirmPayedRequest({
                url: URLS.osgopConfirmPayment, attributes: {
                    uuid: get(data, 'data.result.uuid'),
                    paidAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    insurancePremium: get(data, 'data.result.premium', 0),
                    startDate: get(data, 'data.result.contractStartDate'),
                    endDate: get(data, 'data.result.contractEndDate')
                }
            },
            {
                onSuccess: ({data}) => {

                }
            }
        )
    }

    const remove = () => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            backdrop: 'rgba(0,0,0,0.9)',
            background: 'none',
            title: t('Are you sure?'),
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#13D6D1',
            confirmButtonText: t('Delete'),
            cancelButtonText: t('Cancel'),
            customClass: {
                title: 'title-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRequest({url: `${URLS.osgopDelete}?claimFormId=${claimFormId}`}, {
                    onSuccess: () => {
                        navigate('/osgop')
                    }
                })
            }
        });
    }

    if (isLoading || isLoadingRegion || isLoadingInsuranceTerms || isLoadingCountry) {
        return <OverlayLoader/>
    }


    return (<>
        {(isLoadingFond || deleteLoading || isLoadingConfirmPayed) && <OverlayLoader/>}
        <Panel>
            <Row>
                <Col xs={12}>
                    <Search/>
                </Col>
            </Row>
        </Panel>
        <Section>
            <Row>
                <Col xs={12}>
                    <Title>Параметры полиса</Title>
                </Col>
            </Row>
            <Form footer={!isEqual(get(data, 'data.result.status'), 'payed') && <Flex
                className={'mt-32'}>{(isEqual(get(data, 'data.result.status'), 'new') || isEqual(get(data, 'data.result.status'), 'edited')) && <>
                <Button onClick={remove}
                        danger type={'button'}
                        className={'mr-16'}>Удалить</Button>
                {/*<Button onClick={() => navigate(`/osgop/update/${claimFormId}`)} yellow type={'button'}*/}
                {/*        className={'mr-16'}>Изменить</Button>*/}
            </>}
                <Button
                    onClick={(isEqual(get(data, 'data.result.status'), 'new') || isEqual(get(data, 'data.result.status'), 'edited')) ? () => send() : () => {
                    }}
                    gray={!(isEqual(get(data, 'data.result.status'), 'new') || isEqual(get(data, 'data.result.status'), 'edited'))}
                    type={'button'} className={'mr-16'}>Отправить в
                    Фонд</Button>
                <Button onClick={isEqual(get(data, 'data.result.status'), 'sent') ? () => confirmPayed() : () => {
                }}
                        type={'button'} gray={!isEqual(get(data, 'data.result.status'), 'sent')} className={'mr-16'}>Подтвердить
                    оплату</Button></Flex>}>
                <Row gutterWidth={60} className={'mt-32'}>
                    <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Статус</Col>
                            <Col xs={7}><Button green>{get(data, 'data.result.status')}</Button></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Номер претензионного дела:</Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.claimNumber')}
                                               params={{required: true}} property={{hideLabel: true, disabled: true}}
                                               type={'input'}
                                               name={'claimNumber'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Дата претензионного делa: </Col>
                            <Col xs={7}><Field
                                defaultValue={get(data, 'data.result.claimDate')}
                                params={{required: true}}
                                property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} disabled type={'datepicker'}
                                name={'claimDate'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Серия полиса:</Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.polisSeria')}
                                               params={{required: true}} property={{hideLabel: true, disabled: true}}
                                               type={'input'}
                                               name={'polisSeria'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Номер полиса: </Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.polisNumber')}
                                               params={{required: true}} property={{hideLabel: true, disabled: true}}
                                               type={'input'}
                                               name={'polisNumber'}/></Col>
                        </Row>
                    </Col>
                    <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>

                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Регион претензии:</Col>
                            <Col xs={7}><Field disabled defaultValue={get(data, 'data.result.regionId')}
                                               options={regionList} params={{required: true}}
                                               label={'Insurance term'} property={{hideLabel: true}}
                                               type={'select'}
                                               name={'regionId'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Район претензии:</Col>
                            <Col xs={7}><Field disabled defaultValue={get(data, 'data.result.districtId')}
                                               options={districtList}
                                               label={'Район претензии'} property={{hideLabel: true}}
                                               type={'select'}
                                               name={'districtId'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Тип местности претензии:</Col>
                            <Col xs={7}><Field disabled defaultValue={get(data, 'data.result.areaTypeId')}
                                               options={areaTypesList}
                                               label={'Тип местности претензии'} property={{hideLabel: true}}
                                               type={'select'}
                                               name={'areaTypeId'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Сведения о документах, подтверждающих наследство:</Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.inheritanceDocsInformation')}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'input'}
                                               name={'inheritanceDocsInformation'}/></Col>
                        </Row>
                    </Col>

                    <Col xs={4}>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Дата и время события: </Col>
                            <Col xs={7}><Field
                                disabled
                                defaultValue={get(data, 'data.result.eventCircumstances.eventDateTime')}
                                params={{required: true}}
                                property={{
                                    hideLabel: true,
                                    dateFormat: 'dd.MM.yyyy HH:mm:ss',
                                    showTimeSelect: true
                                }} type={'datepicker'}
                                name={'eventCircumstances.eventDateTime'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Регион события:</Col>
                            <Col xs={7}><Field disabled
                                               defaultValue={get(data, 'data.result.eventCircumstances.regionId')}
                                               options={regionList} params={{required: true}}
                                               label={'Регион события'} property={{hideLabel: true}}
                                               type={'select'}
                                               name={'eventCircumstances.regionId'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Район события:</Col>
                            <Col xs={7}><Field disabled params={{required: true}}
                                               defaultValue={get(data, 'data.result.eventCircumstances.districtId')}
                                               options={districtList}
                                               label={'Район события'} property={{hideLabel: true}}
                                               type={'select'}
                                               name={'eventCircumstances.districtId'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Место события:</Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.eventCircumstances.place')}
                                               params={{required: true}} property={{hideLabel: true, disabled: true}}
                                               type={'input'}
                                               name={'eventCircumstances.place'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Описание случая:</Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.eventCircumstances.eventInfo')}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'input'}
                                               name={'eventCircumstances.eventInfo'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Дата решения суда: </Col>
                            <Col xs={7}><Field
                                disabled
                                defaultValue={get(data, 'data.result.courtDecision.courtDecisionDate')}
                                params={{required: true}}
                                property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                name={'eventCircumstances.courtDecision.courtDecisionDate'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Наименование суда:</Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.courtDecision.court')}
                                               property={{hideLabel: true, disabled: true}}
                                               type={'input'}
                                               name={'eventCircumstances.courtDecision.court'}/></Col>
                        </Row>
                    </Col>
                </Row>

                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-25'}><Title>Заявитель</Title></Col>
                    <Col xs={12}>
                        <Row>
                            <Col xs={4}>
                                <Flex>
                                    <h4 className={'mr-16'}>Заявитель </h4>
                                    <Button

                                        gray={!get(data, 'data.result.applicant.person.gender')}
                                        className={'mr-16'}
                                        type={'button'}>Физ. лицо</Button>
                                    <Button
                                        gray={!get(data, 'data.result.applicant.organization')}
                                        type={'button'}>Юр.
                                        лицо</Button>
                                </Flex>
                            </Col>
                            <Col xs={8} className={'text-right'}>
                                {get(data, 'data.result.applicant.person.gender') && <Flex justify={'flex-end'}>
                                    <Field
                                        disabled
                                        className={'mr-16'} style={{width: 75}}
                                        property={{
                                            hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                        }}
                                        name={'applicant.person.passportData.seria'}
                                        type={'input-mask'}
                                        defaultValue={get(data, 'data.result.applicant.person.passportData.seria')}
                                    />
                                    <Field disabled property={{
                                        hideLabel: true,
                                        mask: '9999999',
                                        placeholder: '1234567',
                                        maskChar: '_',
                                    }} name={'applicant.person.passportData.number'}
                                           type={'input-mask'}
                                           defaultValue={get(data, 'data.result.applicant.person.passportData.number')}
                                    />

                                    <Field className={'ml-15'}
                                           disabled
                                           property={{
                                               hideLabel: true,
                                               placeholder: 'Дата рождения',
                                           }}
                                           name={'applicant.person.birthDate'} type={'datepicker'}
                                           defaultValue={get(data, 'data.result.applicant.person.birthDate')}
                                    />
                                </Flex>}
                                {get(data, 'data.result.applicant.organization') && <Flex justify={'flex-end'}>
                                    <Field
                                        disabled
                                        defaultValue={get(data, 'data.result.applicant.organization.inn')}
                                        property={{
                                            hideLabel: true,
                                            mask: '999999999',
                                            placeholder: 'Inn',
                                            maskChar: '_',
                                            disabled: true
                                        }} name={'applicant.organization.inn'} type={'input-mask'}/>

                                </Flex>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <hr className={'mt-15 mb-15'}/>
                    </Col>
                    {get(data, 'data.result.applicant.person.gender') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(data, 'data.result.applicant.person.fullName.lastname')}
                                   label={'Lastname'}
                                   type={'input'}
                                   name={'applicant.person.fullName.lastname'}
                                   property={{disabled: true}}
                            />
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(data, 'data.result.applicant.person.fullName.firstname')}
                                   label={'Firstname'}
                                   type={'input'}
                                   name={'applicant.person.fullName.firstname'}
                                   property={{disabled: true}}
                            />
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(data, 'data.result.applicant.person.fullName.middlename')}
                                   label={'Middlename'}
                                   type={'input'}
                                   name={'applicant.person.fullName.middlename'}
                                   property={{disabled: true}}
                            />
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled params={{required: true}}
                                   defaultValue={get(data, 'data.result.applicant.person.passportData.startDate')}
                                   label={'Дата выдачи паспорта'}
                                   type={'datepicker'}
                                   name={'applicant.person.passportData.startDate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.result.applicant.person.passportData.issuedBy')}
                                   label={'Кем выдан'}
                                   type={'input'}
                                   name={'applicant.person.passportData.issuedBy'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                defaultValue={get(data, 'data.result.applicant.person.gender')}
                                options={genderList}
                                label={'Gender'}
                                type={'select'}
                                name={'applicant.person.gender'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.applicant.person.passportData.pinfl')}
                                   label={'ПИНФЛ'} type={'input'}
                                   name={'applicant.person.passportData.pinfl'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                params={{
                                    required: true,
                                    pattern: {
                                        value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                        message: 'Invalid format'
                                    }
                                }}
                                defaultValue={get(data, 'data.result.applicant.person.phone')}
                                label={'Phone'}
                                type={'input'}
                                property={{placeholder: '998XXXXXXXXX', disabled: true}}
                                name={'applicant.person.phone'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.result.applicant.person.email')}
                                label={'Email'}
                                type={'input'}
                                property={{disabled: true}}
                                name={'applicant.person.email'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={residentTypeList}
                                defaultValue={get(data, 'data.result.applicant.person.residentType')}
                                label={'Resident type'}
                                type={'select'}
                                name={'applicant.person.residentType'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.applicant.person.driverLicenseSeria')}
                                label={'Серия вод. удостоверения'}
                                type={'input'}
                                name={'applicant.person.driverLicenseSeria'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.applicant.person.driverLicenseNumber')}
                                label={'Номер вод. удостоверения'}
                                type={'input'}
                                name={'applicant.person.driverLicenseNumber'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.result.applicant.person.countryId', 210)}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                name={'applicant.person.countryId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={regionList}
                                defaultValue={get(data, 'data.result.applicant.person.regionId')}
                                label={'Region'}
                                type={'select'}
                                name={'applicant.person.regionId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={districtList}
                                defaultValue={get(data, 'data.result.applicant.person.districtId')}
                                label={'District'}
                                type={'select'}
                                name={'applicant.person.districtId'}/>
                        </Col>

                        <Col xs={6} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                defaultValue={get(data, 'data.result.applicant.person.address')}
                                label={'Address'}
                                type={'input'}
                                property={{disabled: true}}
                                name={'applicant.person.address'}/>
                        </Col>
                    </>}
                    {get(data, 'data.result.applicant.organization') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(data, 'data.result.applicant.organization.name')}
                                   label={'Наименование'} type={'input'}
                                   property={{disabled: true}}
                                   name={'applicant.organization.name'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field defaultValue={get(data, 'data.result.applicant.organization.representativeName')}
                                   label={'Руководитель'} type={'input'}
                                   property={{disabled: true}}
                                   name={'applicant.organization.representativeName'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field defaultValue={get(data, 'data.result.applicant.organization.position')}
                                   label={'Должность'} type={'input'}
                                   property={{disabled: true}}
                                   name={'applicant.organization.position'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.result.applicant.organization.email')}
                                label={'Email'}
                                type={'input'}
                                name={'applicant.organization.email'}
                                property={{disabled: true}}
                            />
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field defaultValue={get(data, 'data.result.applicant.organization.phone')} params={{
                                required: true,
                                pattern: {
                                    value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                    message: 'Invalid format'
                                }
                            }}
                                   property={{placeholder: '998XXXXXXXXX', disabled: true}}
                                   label={'Телефон'} type={'input'}
                                   name={'applicant.organization.phone'}/>
                        </Col>
                        <Col xs={3}><Field disabled
                                           defaultValue={parseInt(get(data, 'data.result.applicant.organization.oked'))}
                                           label={'Oked'} params={{required: true, valueAsString: true}}
                                           options={okedList}
                                           type={'select'}
                                           name={'applicant.organization.oked'}/></Col>

                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.applicant.organization.checkingAccount')}
                                   label={'Расчетный счет'} type={'input'}
                                   name={'applicant.organization.checkingAccount'}/>
                        </Col>
                        <Col xs={3}><Field
                            defaultValue={get(data, 'data.result.applicant.organization.ownershipFormId')}
                            label={'Форма собственности'}
                            options={ownershipFormList}
                            type={'select'}
                            disabled
                            name={'applicant.organization.ownershipFormId'}/></Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                defaultValue={210}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                disabled
                                name={'applicant.organization.countryId'}/>
                        </Col>
                        <Col xs={3}><Field defaultValue={get(data, 'data.result.applicant.organization.regionId')}
                                           label={'Область'} params={{required: true}} options={regionList}
                                           type={'select'}
                                           disabled
                                           name={'applicant.organization.regionId'}/></Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={districtList}
                                defaultValue={get(data, 'data.result.applicant.organization.districtId')}
                                label={'District'}
                                type={'select'}
                                name={'applicant.organization.districtId'}/>
                        </Col>
                        <Col xs={6} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.applicant.organization.address')}
                                label={'Address'}
                                type={'input'}
                                name={'applicant.organization.address'}/>
                        </Col>
                    </>}
                </Row>

                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-25'}><Title>Лицо, ответственное за причиненный вред</Title></Col>
                    <Col xs={12}>
                        <Row>
                            <Col xs={4}>
                                <Flex>
                                    <h4 className={'mr-16'}>Лицо, ответственное за причиненный вред </h4>
                                    <Button

                                        gray={!get(data, 'data.result.responsibleForDamage.person.gender')}
                                        className={'mr-16'}
                                        type={'button'}>Физ. лицо</Button>
                                    <Button
                                        gray={!get(data, 'data.result.responsibleForDamage.organization')}
                                        type={'button'}>Юр.
                                        лицо</Button>
                                </Flex>
                            </Col>
                            <Col xs={8} className={'text-right'}>
                                {get(data, 'data.result.responsibleForDamage.person.gender') &&
                                    <Flex justify={'flex-end'}>
                                        <Field
                                            disabled
                                            className={'mr-16'} style={{width: 75}}
                                            property={{
                                                hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                            }}
                                            name={'applicant.person.passportData.seria'}
                                            type={'input-mask'}
                                            defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.seria')}
                                        />
                                        <Field disabled property={{
                                            hideLabel: true,
                                            mask: '9999999',
                                            placeholder: '1234567',
                                            maskChar: '_',
                                        }} name={'applicant.person.passportData.number'}
                                               type={'input-mask'}
                                               defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.number')}
                                        />

                                        <Field className={'ml-15'}
                                               disabled
                                               property={{
                                                   hideLabel: true,
                                                   placeholder: 'Дата рождения',
                                               }}
                                               name={'applicant.person.birthDate'} type={'datepicker'}
                                               defaultValue={get(data, 'data.result.responsibleForDamage.person.birthDate')}
                                        />
                                    </Flex>}
                                {get(data, 'data.result.responsibleForDamage.organization') &&
                                    <Flex justify={'flex-end'}>
                                        <Field
                                            disabled
                                            defaultValue={get(data, 'data.result.responsibleForDamage.organization.inn')}
                                            property={{
                                                hideLabel: true,
                                                mask: '999999999',
                                                placeholder: 'Inn',
                                                maskChar: '_',
                                                disabled: true
                                            }} name={'applicant.organization.inn'} type={'input-mask'}/>

                                    </Flex>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <hr className={'mt-15 mb-15'}/>
                    </Col>
                    {get(data, 'data.result.responsibleForDamage.person.gender') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.person.fullName.lastname')}
                                   label={'Lastname'}
                                   type={'input'}
                                   name={'applicant.person.fullName.lastname'}
                                   property={{disabled: true}}
                            />
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.person.fullName.firstname')}
                                   label={'Firstname'}
                                   type={'input'}
                                   name={'applicant.person.fullName.firstname'}
                                   property={{disabled: true}}
                            />
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.person.fullName.middlename')}
                                   label={'Middlename'}
                                   type={'input'}
                                   name={'applicant.person.fullName.middlename'}
                                   property={{disabled: true}}
                            />
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled params={{required: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.startDate')}
                                   label={'Дата выдачи паспорта'}
                                   type={'datepicker'}
                                   name={'applicant.person.passportData.startDate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.issuedBy')}
                                   label={'Кем выдан'}
                                   type={'input'}
                                   name={'applicant.person.passportData.issuedBy'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.gender')}
                                options={genderList}
                                label={'Gender'}
                                type={'select'}
                                name={'applicant.person.gender'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.pinfl')}
                                   label={'ПИНФЛ'} type={'input'}
                                   name={'applicant.person.passportData.pinfl'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                params={{
                                    required: true,
                                    pattern: {
                                        value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                        message: 'Invalid format'
                                    }
                                }}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.phone')}
                                label={'Phone'}
                                type={'input'}
                                property={{placeholder: '998XXXXXXXXX', disabled: true}}
                                name={'applicant.person.phone'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.email')}
                                label={'Email'}
                                type={'input'}
                                property={{disabled: true}}
                                name={'applicant.person.email'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={residentTypeList}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.residentType')}
                                label={'Resident type'}
                                type={'select'}
                                name={'applicant.person.residentType'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.driverLicenseSeria')}
                                label={'Серия вод. удостоверения'}
                                type={'input'}
                                name={'applicant.person.driverLicenseSeria'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.driverLicenseNumber')}
                                label={'Номер вод. удостоверения'}
                                type={'input'}
                                name={'applicant.person.driverLicenseNumber'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.countryId', 210)}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                name={'applicant.person.countryId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={regionList}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.regionId')}
                                label={'Region'}
                                type={'select'}
                                name={'applicant.person.regionId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={districtList}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.districtId')}
                                label={'District'}
                                type={'select'}
                                name={'applicant.person.districtId'}/>
                        </Col>

                        <Col xs={6} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.address')}
                                label={'Address'}
                                type={'input'}
                                property={{disabled: true}}
                                name={'applicant.person.address'}/>
                        </Col>
                    </>}
                    {get(data, 'data.result.responsibleForDamage.organization') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.organization.name')}
                                   label={'Наименование'} type={'input'}
                                   property={{disabled: true}}
                                   name={'applicant.organization.name'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.result.responsibleForDamage.organization.representativeName')}
                                label={'Руководитель'} type={'input'}
                                property={{disabled: true}}
                                name={'applicant.organization.representativeName'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field defaultValue={get(data, 'data.result.responsibleForDamage.organization.position')}
                                   label={'Должность'} type={'input'}
                                   property={{disabled: true}}
                                   name={'applicant.organization.position'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.result.responsibleForDamage.organization.email')}
                                label={'Email'}
                                type={'input'}
                                name={'applicant.organization.email'}
                                property={{disabled: true}}
                            />
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field defaultValue={get(data, 'data.result.responsibleForDamage.organization.phone')}
                                   params={{
                                       required: true,
                                       pattern: {
                                           value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                           message: 'Invalid format'
                                       }
                                   }}
                                   property={{placeholder: '998XXXXXXXXX', disabled: true}}
                                   label={'Телефон'} type={'input'}
                                   name={'applicant.organization.phone'}/>
                        </Col>
                        <Col xs={3}><Field disabled
                                           defaultValue={parseInt(get(data, 'data.result.responsibleForDamage.organization.oked'))}
                                           label={'Oked'} params={{required: true, valueAsString: true}}
                                           options={okedList}
                                           type={'select'}
                                           name={'applicant.organization.oked'}/></Col>

                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.organization.checkingAccount')}
                                   label={'Расчетный счет'} type={'input'}
                                   name={'applicant.organization.checkingAccount'}/>
                        </Col>
                        <Col xs={3}><Field
                            defaultValue={get(data, 'data.result.responsibleForDamage.organization.ownershipFormId')}
                            label={'Форма собственности'}
                            options={ownershipFormList}
                            type={'select'}
                            disabled
                            name={'applicant.organization.ownershipFormId'}/></Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                defaultValue={210}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                disabled
                                name={'applicant.organization.countryId'}/>
                        </Col>
                        <Col xs={3}><Field
                            defaultValue={get(data, 'data.result.responsibleForDamage.organization.regionId')}
                            label={'Область'} params={{required: true}} options={regionList}
                            type={'select'}
                            disabled
                            name={'applicant.organization.regionId'}/></Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={districtList}
                                defaultValue={get(data, 'data.result.responsibleForDamage.organization.districtId')}
                                label={'District'}
                                type={'select'}
                                name={'applicant.organization.districtId'}/>
                        </Col>
                        <Col xs={6} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.responsibleForDamage.organization.address')}
                                label={'Address'}
                                type={'input'}
                                name={'applicant.organization.address'}/>
                        </Col>
                    </>}
                </Row>
                {get(data, 'data.result.responsibleVehicleInfo') && <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-15'}><Title>ТС виновного лица:</Title></Col>

                    <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>
                        <div className={'mb-15'}>Государственный номер</div>
                        <div className={'mb-25'}><CarNumber disabled
                                                            defaultValue={get(data, 'data.result.responsibleVehicleInfo.govNumber')}/>
                        </div>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Серия тех.паспорта:</Col>
                            <Col xs={7}><Field
                                defaultValue={get(data, 'data.result.responsibleVehicleInfo.techPassport.seria')}
                                property={{hideLabel: true, disabled: true}}
                                type={'input'}
                                name={'responsibleVehicleInfo.techPassport.seria'}/></Col>
                        </Row>
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Номер тех.паспорта:</Col>
                            <Col xs={7}><Field
                                defaultValue={get(data, 'data.result.responsibleVehicleInfo.techPassport.number')}
                                property={{hideLabel: true, disabled: true}}
                                type={'input'}
                                name={'responsibleVehicleInfo.techPassport.number'}/></Col>
                        </Row>
                    </Col>
                    <Col xs={8}>
                        <Row>
                            <Col xs={4} className="mb-25">
                                <Field disabled defaultValue={get(data, 'data.result.responsibleVehicleInfo.regionId')}
                                       options={regionList}
                                       label={'Территория пользования'}
                                       type={'select'}
                                       name={'responsibleVehicleInfo.regionId'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field property={{disabled: true}}
                                       defaultValue={get(data, 'data.result.responsibleVehicleInfo.modelCustomName')}
                                       label={'Марка / модель'}
                                       type={'input'}
                                       name={'responsibleVehicleInfo.modelCustomName'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field disabled
                                       defaultValue={get(data, 'data.result.responsibleVehicleInfo.vehicleTypeId')}
                                       options={vehicleTypeList}
                                       label={'Вид транспорта'}
                                       type={'select'}
                                       name={'responsibleVehicleInfo.vehicleTypeId'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field disabled defaultValue={get(data, 'data.result.responsibleVehicleInfo.issueYear')}
                                       property={{mask: '9999', maskChar: '_'}}
                                       label={'Год'}
                                       type={'input-mask'}
                                       name={'responsibleVehicleInfo.issueYear'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field property={{disabled: true}}
                                       defaultValue={get(data, 'data.result.responsibleVehicleInfo.bodyNumber')}
                                       label={'Номер кузова (шасси)'}
                                       type={'input'}
                                       name={'responsibleVehicleInfo.bodyNumber'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field property={{disabled: true}}
                                       defaultValue={get(data, 'data.result.responsibleVehicleInfo.engineNumber')}
                                       label={'Номер двигателя'}
                                       type={'input'}
                                       name={'responsibleVehicleInfo.engineNumber'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field property={{disabled: true}}
                                       defaultValue={get(data, 'data.result.responsibleVehicleInfo.fullWeight')}
                                       label={'Объем'}
                                       type={'input'}
                                       name={'responsibleVehicleInfo.fullWeight'}/>
                            </Col>
                            <Col xs={4} className="mb-25">
                                <Field defaultValue={get(data, 'data.result.responsibleVehicleInfo.numberOfSeats')}
                                       property={{type: 'number', disabled: true}}
                                       label={'Количество мест сидения'}
                                       type={'input'}
                                       name={'responsibleVehicleInfo.numberOfSeats'}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>}
                <Row>
                    <Col xs={12} className={'mt-30'}><Checkbox disabled
                                                               checked={get(data, 'data.result.responsibleVehicleInfo.insurantIsOwner')}
                                                               className={'mr-5'}/><strong>ТС владеет лицо,
                        ответственное за вред</strong></Col>
                </Row>
                {
                    get(data, 'data.result.responsibleVehicleInfo.insurantIsOwner') ?
                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-25'}><Title>Владелец ТС</Title></Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={4}>
                                        <Flex>
                                            <h4 className={'mr-16'}>Лицо, ответственное за причиненный вред </h4>
                                            <Button

                                                gray={!get(data, 'data.result.responsibleForDamage.person.gender')}
                                                className={'mr-16'}
                                                type={'button'}>Физ. лицо</Button>
                                            <Button
                                                gray={!get(data, 'data.result.responsibleForDamage.organization')}
                                                type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {get(data, 'data.result.responsibleForDamage.person.gender') &&
                                            <Flex justify={'flex-end'}>
                                                <Field
                                                    disabled
                                                    className={'mr-16'} style={{width: 75}}
                                                    property={{
                                                        hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                    }}
                                                    name={'applicant.person.passportData.seria'}
                                                    type={'input-mask'}
                                                    defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.seria')}
                                                />
                                                <Field disabled property={{
                                                    hideLabel: true,
                                                    mask: '9999999',
                                                    placeholder: '1234567',
                                                    maskChar: '_',
                                                }} name={'applicant.person.passportData.number'}
                                                       type={'input-mask'}
                                                       defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.number')}
                                                />

                                                <Field className={'ml-15'}
                                                       disabled
                                                       property={{
                                                           hideLabel: true,
                                                           placeholder: 'Дата рождения',
                                                       }}
                                                       name={'applicant.person.birthDate'} type={'datepicker'}
                                                       defaultValue={get(data, 'data.result.responsibleForDamage.person.birthDate')}
                                                />
                                            </Flex>}
                                        {get(data, 'data.result.responsibleForDamage.organization') &&
                                            <Flex justify={'flex-end'}>
                                                <Field
                                                    disabled
                                                    defaultValue={get(data, 'data.result.responsibleForDamage.organization.inn')}
                                                    property={{
                                                        hideLabel: true,
                                                        mask: '999999999',
                                                        placeholder: 'Inn',
                                                        maskChar: '_',
                                                        disabled: true
                                                    }} name={'applicant.organization.inn'} type={'input-mask'}/>

                                            </Flex>}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            {get(data, 'data.result.responsibleForDamage.person.gender') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.person.fullName.lastname')}
                                           label={'Lastname'}
                                           type={'input'}
                                           name={'applicant.person.fullName.lastname'}
                                           property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.person.fullName.firstname')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'applicant.person.fullName.firstname'}
                                           property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.person.fullName.middlename')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'applicant.person.fullName.middlename'}
                                           property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field disabled params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'applicant.person.passportData.startDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}} params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'applicant.person.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'applicant.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.pinfl')}
                                           label={'ПИНФЛ'} type={'input'}
                                           name={'applicant.person.passportData.pinfl'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{
                                            required: true,
                                            pattern: {
                                                value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                                message: 'Invalid format'
                                            }
                                        }}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        property={{placeholder: '998XXXXXXXXX', disabled: true}}
                                        name={'applicant.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.email')}
                                        label={'Email'}
                                        type={'input'}
                                        property={{disabled: true}}
                                        name={'applicant.person.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={residentTypeList}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.residentType')}
                                        label={'Resident type'}
                                        type={'select'}
                                        name={'applicant.person.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.driverLicenseSeria')}
                                        label={'Серия вод. удостоверения'}
                                        type={'input'}
                                        name={'applicant.person.driverLicenseSeria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.driverLicenseNumber')}
                                        label={'Номер вод. удостоверения'}
                                        type={'input'}
                                        name={'applicant.person.driverLicenseNumber'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.countryId', 210)}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'applicant.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={regionList}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'applicant.person.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'applicant.person.districtId'}/>
                                </Col>

                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.address')}
                                        label={'Address'}
                                        type={'input'}
                                        property={{disabled: true}}
                                        name={'applicant.person.address'}/>
                                </Col>
                            </>}
                            {get(data, 'data.result.responsibleForDamage.organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.organization.name')}
                                           label={'Наименование'} type={'input'}
                                           property={{disabled: true}}
                                           name={'applicant.organization.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleForDamage.organization.representativeName')}
                                        label={'Руководитель'} type={'input'}
                                        property={{disabled: true}}
                                        name={'applicant.organization.representativeName'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleForDamage.organization.position')}
                                        label={'Должность'} type={'input'}
                                        property={{disabled: true}}
                                        name={'applicant.organization.position'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleForDamage.organization.email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'applicant.organization.email'}
                                        property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleForDamage.organization.phone')}
                                        params={{
                                            required: true,
                                            pattern: {
                                                value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                                message: 'Invalid format'
                                            }
                                        }}
                                        property={{placeholder: '998XXXXXXXXX', disabled: true}}
                                        label={'Телефон'} type={'input'}
                                        name={'applicant.organization.phone'}/>
                                </Col>
                                <Col xs={3}><Field disabled
                                                   defaultValue={parseInt(get(data, 'data.result.responsibleForDamage.organization.oked'))}
                                                   label={'Oked'} params={{required: true, valueAsString: true}}
                                                   options={okedList}
                                                   type={'select'}
                                                   name={'applicant.organization.oked'}/></Col>

                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.organization.checkingAccount')}
                                           label={'Расчетный счет'} type={'input'}
                                           name={'applicant.organization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field
                                    defaultValue={get(data, 'data.result.responsibleForDamage.organization.ownershipFormId')}
                                    label={'Форма собственности'}
                                    options={ownershipFormList}
                                    type={'select'}
                                    disabled
                                    name={'applicant.organization.ownershipFormId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={210}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        disabled
                                        name={'applicant.organization.countryId'}/>
                                </Col>
                                <Col xs={3}><Field
                                    defaultValue={get(data, 'data.result.responsibleForDamage.organization.regionId')}
                                    label={'Область'} params={{required: true}} options={regionList}
                                    type={'select'}
                                    disabled
                                    name={'applicant.organization.regionId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.organization.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'applicant.organization.districtId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.organization.address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'applicant.organization.address'}/>
                                </Col>
                            </>}
                        </Row> : <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-25'}><Title>Владелец ТС</Title></Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={4}>
                                        <Flex>
                                            <h4 className={'mr-16'}>Лицо, ответственное за причиненный вред </h4>
                                            <Button

                                                gray={!get(data, 'data.result.responsibleVehicleInfo.person.gender')}
                                                className={'mr-16'}
                                                type={'button'}>Физ. лицо</Button>
                                            <Button
                                                gray={!get(data, 'data.result.responsibleVehicleInfo.organization')}
                                                type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {get(data, 'data.result.responsibleVehicleInfo.person.gender') &&
                                            <Flex justify={'flex-end'}>
                                                <Field
                                                    disabled
                                                    className={'mr-16'} style={{width: 75}}
                                                    property={{
                                                        hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                    }}
                                                    name={'applicant.person.passportData.seria'}
                                                    type={'input-mask'}
                                                    defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.passportData.seria')}
                                                />
                                                <Field disabled property={{
                                                    hideLabel: true,
                                                    mask: '9999999',
                                                    placeholder: '1234567',
                                                    maskChar: '_',
                                                }} name={'applicant.person.passportData.number'}
                                                       type={'input-mask'}
                                                       defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.passportData.number')}
                                                />

                                                <Field className={'ml-15'}
                                                       disabled
                                                       property={{
                                                           hideLabel: true,
                                                           placeholder: 'Дата рождения',
                                                       }}
                                                       name={'applicant.person.birthDate'} type={'datepicker'}
                                                       defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.birthDate')}
                                                />
                                            </Flex>}
                                        {get(data, 'data.result.responsibleForDamage.organization') &&
                                            <Flex justify={'flex-end'}>
                                                <Field
                                                    disabled
                                                    defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.inn')}
                                                    property={{
                                                        hideLabel: true,
                                                        mask: '999999999',
                                                        placeholder: 'Inn',
                                                        maskChar: '_',
                                                        disabled: true
                                                    }} name={'applicant.organization.inn'} type={'input-mask'}/>

                                            </Flex>}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            {get(data, 'data.result.responsibleVehicleInfo.person.gender') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.fullName.lastname')}
                                           label={'Lastname'}
                                           type={'input'}
                                           name={'applicant.person.fullName.lastname'}
                                           property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.fullName.firstname')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'applicant.person.fullName.firstname'}
                                           property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.fullName.middlename')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'applicant.person.fullName.middlename'}
                                           property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field disabled params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.passportData.startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'applicant.person.passportData.startDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}} params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.passportData.issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'applicant.person.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'applicant.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.passportData.pinfl')}
                                           label={'ПИНФЛ'} type={'input'}
                                           name={'applicant.person.passportData.pinfl'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{
                                            required: true,
                                            pattern: {
                                                value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                                message: 'Invalid format'
                                            }
                                        }}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        property={{placeholder: '998XXXXXXXXX', disabled: true}}
                                        name={'applicant.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.email')}
                                        label={'Email'}
                                        type={'input'}
                                        property={{disabled: true}}
                                        name={'applicant.person.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={residentTypeList}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.residentType')}
                                        label={'Resident type'}
                                        type={'select'}
                                        name={'applicant.person.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.driverLicenseSeria')}
                                        label={'Серия вод. удостоверения'}
                                        type={'input'}
                                        name={'applicant.person.driverLicenseSeria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.driverLicenseNumber')}
                                        label={'Номер вод. удостоверения'}
                                        type={'input'}
                                        name={'applicant.person.driverLicenseNumber'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.countryId', 210)}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'applicant.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={regionList}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'applicant.person.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'applicant.person.districtId'}/>
                                </Col>

                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.address')}
                                        label={'Address'}
                                        type={'input'}
                                        property={{disabled: true}}
                                        name={'applicant.person.address'}/>
                                </Col>
                            </>}
                            {get(data, 'data.result.responsibleVehicleInfo.organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.name')}
                                           label={'Наименование'} type={'input'}
                                           property={{disabled: true}}
                                           name={'applicant.organization.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.representativeName')}
                                        label={'Руководитель'} type={'input'}
                                        property={{disabled: true}}
                                        name={'applicant.organization.representativeName'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.position')}
                                        label={'Должность'} type={'input'}
                                        property={{disabled: true}}
                                        name={'applicant.organization.position'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'applicant.organization.email'}
                                        property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.phone')}
                                           params={{
                                               required: true,
                                               pattern: {
                                                   value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                                   message: 'Invalid format'
                                               }
                                           }}
                                           property={{placeholder: '998XXXXXXXXX', disabled: true}}
                                           label={'Телефон'} type={'input'}
                                           name={'applicant.organization.phone'}/>
                                </Col>
                                <Col xs={3}><Field disabled
                                                   defaultValue={parseInt(get(data, 'data.result.responsibleVehicleInfo.organization.oked'))}
                                                   label={'Oked'} params={{required: true, valueAsString: true}}
                                                   options={okedList}
                                                   type={'select'}
                                                   name={'applicant.organization.oked'}/></Col>

                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.checkingAccount')}
                                           label={'Расчетный счет'} type={'input'}
                                           name={'applicant.organization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field
                                    defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.ownershipFormId')}
                                    label={'Форма собственности'}
                                    options={ownershipFormList}
                                    type={'select'}
                                    disabled
                                    name={'applicant.organization.ownershipFormId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={210}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        disabled
                                        name={'applicant.organization.countryId'}/>
                                </Col>
                                <Col xs={3}><Field
                                    defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.regionId')}
                                    label={'Область'} params={{required: true}} options={regionList}
                                    type={'select'}
                                    disabled
                                    name={'applicant.organization.regionId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'applicant.organization.districtId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'applicant.organization.address'}/>
                                </Col>
                            </>}
                        </Row>
                }
                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-15'}><Title>Вред жизни(Потерпевшие)</Title></Col>
                    <Col xs={12}>
                        <div className={'horizontal-scroll mt-15 mb-25'}>
                            <Table bordered hideThead={false}
                                   thead={['№ ', 'ПИНФЛ', 'Фамилия', 'Имя', 'Отчество']}>
                                {
                                    get(data, 'data.result.lifeDamage', []).map((item, index) => <tr>

                                        <td>{index + 1}</td>
                                        <td>{get(item, 'person.passportData.pinfl')}</td>
                                        <td>{get(item, 'person.fullName.lastname')}</td>
                                        <td>{get(item, 'person.fullName.firstname')}</td>
                                        <td>{get(item, 'person.fullName.middlename')}</td>
                                    </tr>)
                                }
                            </Table>
                        </div>
                    </Col>
                </Row>
                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-15'}><Title>Вред здоровью(Потерпевшие)</Title></Col>
                    <Col xs={12}>
                        <div className={'horizontal-scroll mt-15 mb-25'}>
                            <Table bordered hideThead={false}
                                   thead={['№ ', 'ПИНФЛ', 'Фамилия', 'Имя', 'Отчество']}>
                                {
                                    get(data, 'data.result.healthDamage', []).map((item, index) => <tr>

                                        <td>{index + 1}</td>
                                        <td>{get(item, 'person.passportData.pinfl')}</td>
                                        <td>{get(item, 'person.fullName.lastname')}</td>
                                        <td>{get(item, 'person.fullName.firstname')}</td>
                                        <td>{get(item, 'person.fullName.middlename')}</td>

                                    </tr>)
                                }
                            </Table>
                        </div>
                    </Col>
                </Row>
                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-15'}><Title>Вред ТС(Пострадавшие ТС)</Title></Col>
                    <Col xs={12}>
                        <div className={'horizontal-scroll mt-15 mb-25'}>
                            <Table bordered hideThead={false}
                                   thead={['№ ', 'Гос.номер', 'Модель', 'Серия тех.паспорта', 'Номер тех.паспорта']}>
                                {
                                    get(data, 'data.result.vehicleDamage', []).map((item, index) => <tr>
                                        <td>{index + 1}</td>
                                        <td>{get(item, 'vehicle.govNumber')}</td>
                                        <td>{get(item, 'vehicle.modelCustomName')}</td>
                                        <td>{get(item, 'vehicle.techPassport.seria')}</td>
                                        <td>{get(item, 'vehicle.techPassport.number')}</td>
                                    </tr>)
                                }
                            </Table>
                        </div>
                    </Col>
                </Row>
                <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-15'}><Title>Вред иному имуществу(Пострадавшее имущество)</Title></Col>
                    <Col xs={12}>
                        <div className={'horizontal-scroll mt-15 mb-25'}>
                            <Table bordered hideThead={false}
                                   thead={['№ ', 'Описание имущества', 'Размер вреда', 'Action']}>
                                {
                                    get(data, 'data.result.otherPropertyDamage', []).map((item, index) => <tr>
                                        <td>{index + 1}</td>
                                        <td>{get(item, 'otherPropertyDamage.property')}</td>
                                        <td>{get(item, 'otherPropertyDamage.claimedDamage')}</td>
                                    </tr>)
                                }
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Form>
        </Section>
    </>);
};

export default ViewContainer;