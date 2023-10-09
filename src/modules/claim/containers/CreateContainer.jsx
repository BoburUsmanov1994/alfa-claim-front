import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {find, get, isEqual, upperCase, values, isEmpty, sumBy, includes} from "lodash";
import Panel from "../../../components/panel";
import Search from "../../../components/search";
import {Col, Row} from "react-grid-system";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import Button from "../../../components/ui/button";
import Form from "../../../containers/form/form";
import Flex from "../../../components/flex";
import Field from "../../../containers/form/field";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {getSelectOptionsListFromData} from "../../../utils";
import {OverlayLoader} from "../../../components/loader";
import dayjs from "dayjs";
import {toast} from "react-toastify";
import Modal from "../../../components/modal";
import Table from "../../../components/table";
import {Trash2} from "react-feather";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import CarNumber from "../../../components/car-number"
import Checkbox from "rc-checkbox";

const CreateContainer = () => {
    const [applicant, setApplicant] = useState({
        type: 'person',
        inn: null,
        seria: null,
        number: null,
        person: null,
        organization: null,
        birthDate: null,
        regionId: null,
    })
    const [responsible, setResponsible] = useState({
        type: 'person',
        inn: null,
        seria: null,
        number: null,
        person: null,
        organization: null,
        birthDate: null,
        regionId: null,
    })
    const [owner, setOwner] = useState({
        type: 'person',
        inn: null,
        seria: null,
        number: null,
        person: null,
        organization: null,
        birthDate: null,
        regionId: null,
    })
    const [lifeDamage, setLifeDamage] = useState({
        type: 'person',
        seria: null,
        number: null,
        person: null,
        birthDate: null,
        regionId: null,
        list: []
    })
    const [healthDamage, setHealthDamage] = useState({
        type: 'person',
        seria: null,
        number: null,
        person: null,
        birthDate: null,
        regionId: null,
        list: []
    })
    const [vehicleDamage, setVehicleDamage] = useState({
        type: 'person',
        seria: null,
        number: null,
        person: null,
        organization: null,
        birthDate: null,
        regionId: null,
        inn: null,
        techSeria: null,
        techNumber: null,
        vehicle: null,
        govNumber: null,
        list: []
    })
    const [propertyDamage, setPropertyDamage] = useState({
        type: 'person',
        inn: null,
        seria: null,
        number: null,
        person: null,
        organization: null,
        birthDate: null,
        regionId: null,
        list: []
    })
    const [vehicle, setVehicle] = useState(null)
    const [govNumber, setGovNumber] = useState(null)
    const [techPassportSeria, setTechPassportSeria] = useState(null)
    const [techPassportNumber, setTechPassportNumber] = useState(null)
    const [visible, setVisible] = useState(false)
    const [regionId, setRegionId] = useState(null)
    const [eventRegionId, setEventRegionId] = useState(null)
    const [otherParams, setOtherParams] = useState({})
    const [visibleLifeDamage, setVisibleLifeDamage] = useState(false);
    const [visibleHealthDamage, setVisibleHealthDamage] = useState(false);
    const [visibleOtherPropertyDamage, setVisibleOtherPropertyDamage] = useState(false);
    const [insurantIsOwner, setInsurantIsOwner] = useState(false)

    const navigate = useNavigate();
    const {t} = useTranslation()

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'Claim', path: '/claim',
    }, {
        id: 2, title: 'Add', path: '/claim/create',
    }], [])


    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])


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


    const {data: vehicleTypes} = useGetAllQuery({
        key: KEYS.vehicleTypes, url: URLS.vehicleTypes
    })
    const vehicleTypeList = getSelectOptionsListFromData(get(vehicleTypes, `data.result`, []), 'id', 'name')

    const {data: ownershipForms} = useGetAllQuery({
        key: KEYS.ownershipForms, url: URLS.ownershipForms
    })
    const ownershipFormList = getSelectOptionsListFromData(get(ownershipForms, `data.result`, []), 'id', 'name')


    const {data: country, isLoading: isLoadingCountry} = useGetAllQuery({
        key: KEYS.countries, url: URLS.countries
    })
    const countryList = getSelectOptionsListFromData(get(country, `data.result`, []), 'id', 'name')

    const {data: okeds} = useGetAllQuery({
        key: KEYS.okeds, url: URLS.okeds
    })
    const okedList = getSelectOptionsListFromData(get(okeds, `data.result`, []), 'id', 'name')

    const {data: areaTypes} = useGetAllQuery({
        key: KEYS.areaTypes, url: URLS.areaTypes
    })
    const areaTypesList = getSelectOptionsListFromData(get(areaTypes, `data.result`, []), 'id', 'name')

    const {data: district} = useGetAllQuery({
        key: [KEYS.districts, regionId],
        url: URLS.districts,
        params: {
            params: {
                region: regionId
            }
        },
        enabled: !!(regionId)
    })
    const districtList = getSelectOptionsListFromData(get(district, `data.result`, []), 'id', 'name')

    const {data: eventDistrict} = useGetAllQuery({
        key: [KEYS.districts, regionId],
        url: URLS.districts,
        params: {
            params: {
                region: eventRegionId
            }
        },
        enabled: !!(eventRegionId)
    })

    const eventDistrictList = getSelectOptionsListFromData(get(eventDistrict, `data.result`, []), 'id', 'name')

    const {data: applicantDistrict} = useGetAllQuery({
        key: [KEYS.districts, regionId],
        url: URLS.districts,
        params: {
            params: {
                region: get(applicant, 'regionId')
            }
        },
        enabled: !!(get(applicant, 'regionId'))
    })

    const applicantDistrictList = getSelectOptionsListFromData(get(applicantDistrict, `data.result`, []), 'id', 'name')

    const {data: responsibleDistrict} = useGetAllQuery({
        key: [KEYS.districts, regionId],
        url: URLS.districts,
        params: {
            params: {
                region: get(responsible, 'regionId')
            }
        },
        enabled: !!(get(responsible, 'regionId'))
    })

    const responsibleDistrictList = getSelectOptionsListFromData(get(responsibleDistrict, `data.result`, []), 'id', 'name')

    const {data: ownerDistrict} = useGetAllQuery({
        key: [KEYS.districts, regionId],
        url: URLS.districts,
        params: {
            params: {
                region: get(owner, 'regionId')
            }
        },
        enabled: !!(get(owner, 'regionId'))
    })

    const ownerDistrictList = getSelectOptionsListFromData(get(ownerDistrict, `data.result`, []), 'id', 'name')

    const {data: lifeDamageDistrict} = useGetAllQuery({
        key: [KEYS.districts, regionId],
        url: URLS.districts,
        params: {
            params: {
                region: get(lifeDamage, 'regionId')
            }
        },
        enabled: !!(get(lifeDamage, 'regionId'))
    })

    const lifeDamageDistrictList = getSelectOptionsListFromData(get(lifeDamageDistrict, `data.result`, []), 'id', 'name')

    const {data: healthDamageDistrict} = useGetAllQuery({
        key: [KEYS.districts, regionId],
        url: URLS.districts,
        params: {
            params: {
                region: get(healthDamage, 'regionId')
            }
        },
        enabled: !!(get(healthDamage, 'regionId'))
    })

    const healthDamageDistrictList = getSelectOptionsListFromData(get(healthDamageDistrict, `data.result`, []), 'id', 'name')

    const {data: vehicleDamageDistrict} = useGetAllQuery({
        key: [KEYS.districts, regionId],
        url: URLS.districts,
        params: {
            params: {
                region: get(vehicleDamage, 'regionId')
            }
        },
        enabled: !!(get(vehicleDamage, 'regionId'))
    })

    const vehicleDamageDistrictList = getSelectOptionsListFromData(get(vehicleDamageDistrict, `data.result`, []), 'id', 'name')

    const {data: propertyDamageDistrict} = useGetAllQuery({
        key: [KEYS.districts, regionId],
        url: URLS.districts,
        params: {
            params: {
                region: get(propertyDamage, 'regionId')
            }
        },
        enabled: !!(get(propertyDamage, 'regionId'))
    })

    const propertyDamageDistrictList = getSelectOptionsListFromData(get(propertyDamageDistrict, `data.result`, []), 'id', 'name')

    const {
        mutate: getPersonalInfoRequest, isLoading: isLoadingPersonalInfo
    } = usePostQuery({listKeyId: KEYS.personalInfoProvider})

    const {
        mutate: getOrganizationInfoRequest, isLoading: isLoadingOrganizationInfo
    } = usePostQuery({listKeyId: KEYS.organizationInfoProvider})

    const {
        mutate: getVehicleInfoRequest, isLoading: isLoadingVehicleInfo
    } = usePostQuery({listKeyId: KEYS.vehicleInfoProvider})


    const {
        mutate: createRequest, isLoading: isLoadingPost
    } = usePostQuery({listKeyId: KEYS.osgopCreate})

    const getInfo = (type = 'applicant') => {
        getPersonalInfoRequest({
                url: URLS.personalInfoProvider, attributes: type == 'responsible' ? {
                    birthDate: dayjs(get(responsible, 'birthDate')).format('YYYY-MM-DD'),
                    passportSeries: get(responsible, 'seria'),
                    passportNumber: get(responsible, 'number')
                } : type == 'propertyDamage' ? {
                    birthDate: dayjs(get(propertyDamage, 'birthDate')).format('YYYY-MM-DD'),
                    passportSeries: get(propertyDamage, 'seria'),
                    passportNumber: get(propertyDamage, 'number')
                } : type == 'owner' ? {
                    birthDate: dayjs(get(owner, 'birthDate')).format('YYYY-MM-DD'),
                    passportSeries: get(owner, 'seria'),
                    passportNumber: get(owner, 'number')
                } : type == 'lifeDamage' ? {
                    birthDate: dayjs(get(lifeDamage, 'birthDate')).format('YYYY-MM-DD'),
                    passportSeries: get(lifeDamage, 'seria'),
                    passportNumber: get(lifeDamage, 'number')
                } : type == 'healthDamage' ? {
                    birthDate: dayjs(get(healthDamage, 'birthDate')).format('YYYY-MM-DD'),
                    passportSeries: get(healthDamage, 'seria'),
                    passportNumber: get(healthDamage, 'number')
                } : type == 'vehicleDamage' ? {
                    birthDate: dayjs(get(vehicleDamage, 'birthDate')).format('YYYY-MM-DD'),
                    passportSeries: get(vehicleDamage, 'seria'),
                    passportNumber: get(vehicleDamage, 'number')
                } : {
                    birthDate: dayjs(get(applicant, 'birthDate')).format('YYYY-MM-DD'),
                    passportSeries: get(applicant, 'seria'),
                    passportNumber: get(applicant, 'number')
                }
            },
            {
                onSuccess: ({data}) => {
                    if (type == 'applicant') {
                        setApplicant(prev => ({...prev, person: get(data, 'result')}));
                    }
                    if (type == 'responsible') {
                        setResponsible(prev => ({...prev, person: get(data, 'result')}));
                    }
                    if (type == 'propertyDamage') {
                        setPropertyDamage(prev => ({...prev, person: get(data, 'result')}));
                    }
                    if (type == 'owner') {
                        setOwner(prev => ({...prev, person: get(data, 'result')}));
                    }
                    if (type == 'lifeDamage') {
                        setLifeDamage(prev => ({...prev, person: get(data, 'result')}));
                    }
                    if (type == 'healthDamage') {
                        setHealthDamage(prev => ({...prev, person: get(data, 'result')}));
                    }
                    if (type == 'vehicleDamage') {
                        setVehicleDamage(prev => ({...prev, person: get(data, 'result')}));
                    }
                }
            }
        )
    }

    const getOrgInfo = (type = 'applicant') => {
        getOrganizationInfoRequest({
                url: URLS.organizationInfoProvider, attributes: type == 'responsible' ? {
                    inn: get(responsible, 'inn')
                } : type == 'owner' ? {
                    inn: get(owner, 'inn')
                } : type == 'propertyDamage' ? {inn: get(propertyDamage, 'inn')} : type == 'vehicleDamage' ? {inn: get(vehicleDamage, 'inn')} : {
                    inn: get(applicant, 'inn')
                }
            },
            {
                onSuccess: ({data}) => {
                    if (type == 'applicant') {
                        setApplicant(prev => ({...prev, organization: get(data, 'result')}));
                    }
                    if (type == 'responsible') {
                        setResponsible(prev => ({...prev, organization: get(data, 'result')}));
                    }
                    if (type == 'propertyDamage') {
                        setPropertyDamage(prev => ({...prev, organization: get(data, 'result')}));
                    }
                    if (type == 'owner') {
                        setOwner(prev => ({...prev, organization: get(data, 'result')}));
                    }
                    if (type == 'vehicleDamage') {
                        setVehicleDamage(prev => ({...prev, organization: get(data, 'result')}));
                    }
                }
            }
        )
    }

    const getVehicleInfo = (vehicle_type = 'vehicle') => {
        if (vehicle_type == 'vehicleDamage') {
            if (get(vehicleDamage, 'govNumber') && get(vehicleDamage, 'techSeria') && get(vehicleDamage, 'techNumber')) {
                getVehicleInfoRequest({
                        url: URLS.vehicleInfoProvider, attributes: {
                            govNumber: get(vehicleDamage, 'govNumber'),
                            techPassportNumber: get(vehicleDamage, 'techNumber'),
                            techPassportSeria: get(vehicleDamage, 'techSeria')
                        }
                    },
                    {
                        onSuccess: ({data}) => {
                            setVehicleDamage(prev => ({...prev, vehicle: get(data, 'result')}))
                        }
                    }
                )
            } else {
                toast.warn('Please fill all fields')
            }
        } else {
            if (govNumber && techPassportNumber && techPassportSeria) {
                getVehicleInfoRequest({
                        url: URLS.vehicleInfoProvider, attributes: {
                            govNumber,
                            techPassportNumber,
                            techPassportSeria
                        }
                    },
                    {
                        onSuccess: ({data}) => {
                            setVehicle(get(data, 'result'))
                        }
                    }
                )
            } else {
                toast.warn('Please fill all fields')
            }
        }
    }


    const getFieldData = (name, value) => {

        if (isEqual(name, 'regionId')) {
            setRegionId(value)
        }
        if (isEqual(name, 'eventCircumstances.regionId')) {
            setEventRegionId(value)
        }
        if (isEqual(name, 'applicant.person.regionId') || isEqual(name, 'applicant.organization.regionId')) {
            setApplicant(prev => ({...prev, regionId: value}))
        }
        if (isEqual(name, 'responsibleVehicleInfo.ownerPerson.regionId') || isEqual(name, 'responsibleVehicleInfo.ownerOrganization.regionId')) {
            setOwner(prev => ({...prev, regionId: value}))
        }
        if (isEqual(name, 'otherPropertyDamage.ownerPerson.regionId') || isEqual(name, 'otherPropertyDamage.ownerOrganization.regionId')) {
            setPropertyDamage(prev => ({...prev, regionId: value}))
        }
        if (isEqual(name, 'healthDamage.person.regionId') || isEqual(name, 'healthDamage.organization.regionId')) {
            setHealthDamage(prev => ({...prev, regionId: value}))
        }
        if (isEqual(name, 'responsibleForDamage.person.regionId') || isEqual(name, 'responsibleForDamage.organization.regionId')) {
            setResponsible(prev => ({...prev, regionId: value}))
        }
        if (isEqual(name, 'vehicleDamage.vehicle.ownerPerson.regionId') || isEqual(name, 'vehicleDamage.vehicle.ownerOrganization.regionId')) {
            setVehicleDamage(prev => ({...prev, regionId: value}))
        }
        if (isEqual(name, 'lifeDamage.person.regionId')) {
            setLifeDamage(prev => ({...prev, regionId: value}))
        }
        if (isEqual(name, 'responsibleVehicleInfo.techPassport.number')) {
            setTechPassportNumber(value)
        }
        if (isEqual(name, 'responsibleVehicleInfo.techPassport.seria')) {
            setTechPassportSeria(value)
        }
        setOtherParams(prev => ({...prev, [name]: value}))
    }

    const create = ({data}) => {
        debugger
        const {
            insuranceSumForPassenger,
            passengerCapacity,
            birthDate,
            passportNumber,
            passportSeries,
            inn,
            responsibleForDamage,
            responsibleVehicleInfo,
            ...rest
        } = data
        const {ownerPerson,ownerOrganization,...responsibleVehicleInfoRest} = responsibleVehicleInfo;
        createRequest({
                url: URLS.create, attributes: {
                    ...rest,
                    responsibleVehicleInfo:insurantIsOwner ? {...responsibleVehicleInfoRest,insurantIsOwner:true,govNumber:govNumber} : {...responsibleVehicleInfoRest,ownerPerson,ownerOrganization,govNumber:govNumber},
                    responsibleForDamage:{...responsibleForDamage,regionId:get(responsible,'regionId')},
                    lifeDamage: get(lifeDamage, 'list', []).map(_item => get(_item, 'lifeDamage')),
                    healthDamage: get(healthDamage, 'list', []).map(_item => get(_item, 'healthDamage')),
                    vehicleDamage: get(vehicleDamage, 'list', []).map(_item => get(_item, 'vehicleDamage')),
                    otherPropertyDamage: get(propertyDamage, 'list', []).map(_item => get(_item, 'otherPropertyDamage'))
                }
            },
            {
                onSuccess: ({data: response}) => {
                    if (get(response, 'result.osgop_formId')) {
                        navigate(`/claim/view/${get(response, 'result.osgop_formId')}`);
                    } else {
                        navigate(`/claim`);
                    }
                }
            }
        )
    }


    if (isLoadingRegion) {
        return <OverlayLoader/>
    }


    return (<>
        {(isLoadingCountry || isLoadingPersonalInfo || isLoadingOrganizationInfo || isLoadingVehicleInfo || isLoadingPost) &&
            <OverlayLoader/>}
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
            <Row>
                <Col xs={12}>
                    <Form formRequest={create} getValueFromField={(value, name) => getFieldData(name, value)}
                          footer={<Flex className={'mt-32'}><Button className={'mr-16'}>Сохранить</Button></Flex>}>
                        <Row gutterWidth={60} className={'mt-32'}>
                            <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Статус</Col>
                                    <Col xs={7}><Button green>Новый</Button></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер претензионного дела:</Col>
                                    <Col xs={7}><Field params={{required: true}} property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'claimNumber'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата претензионного делa: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'claimDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Серия полиса:</Col>
                                    <Col xs={7}><Field params={{required: true}} property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'polisSeria'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер полиса: </Col>
                                    <Col xs={7}><Field params={{required: true}} property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'polisNumber'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Регион претензии:</Col>
                                    <Col xs={7}><Field options={regionList} params={{required: true}}
                                                       label={'Insurance term'} property={{hideLabel: true}}
                                                       type={'select'}
                                                       name={'regionId'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Район претензии:</Col>
                                    <Col xs={7}><Field options={districtList}
                                                       label={'Район претензии'} property={{hideLabel: true}}
                                                       type={'select'}
                                                       name={'districtId'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Тип местности претензии:</Col>
                                    <Col xs={7}><Field options={areaTypesList}
                                                       label={'Тип местности претензии'} property={{hideLabel: true}}
                                                       type={'select'}
                                                       name={'areaTypeId'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Сведения о документах, подтверждающих наследство:</Col>
                                    <Col xs={7}><Field property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'inheritanceDocsInformation'}/></Col>
                                </Row>
                            </Col>

                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата и время события: </Col>
                                    <Col xs={7}><Field
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
                                    <Col xs={7}><Field options={regionList} params={{required: true}}
                                                       label={'Регион события'} property={{hideLabel: true}}
                                                       type={'select'}
                                                       name={'eventCircumstances.regionId'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Район события:</Col>
                                    <Col xs={7}><Field params={{required: true}} options={eventDistrictList}
                                                       label={'Район события'} property={{hideLabel: true}}
                                                       type={'select'}
                                                       name={'eventCircumstances.districtId'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Место события:</Col>
                                    <Col xs={7}><Field params={{required: true}} property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'eventCircumstances.place'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Описание случая:</Col>
                                    <Col xs={7}><Field property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'eventCircumstances.eventInfo'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата решения суда: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'eventCircumstances.courtDecision.courtDecisionDate'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Наименование суда:</Col>
                                    <Col xs={7}><Field property={{hideLabel: true}}
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
                                            <Button onClick={() => setApplicant(prev => ({
                                                ...prev,
                                                type: 'person'
                                            }))}
                                                    gray={!isEqual(get(applicant, 'type'), 'person')}
                                                    className={'mr-16'}
                                                    type={'button'}>Физ. лицо</Button>
                                            <Button onClick={() => setApplicant(prev => ({
                                                ...prev,
                                                type: 'organization'
                                            }))}
                                                    gray={!isEqual(get(applicant, 'type'), 'organization')}
                                                    type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {isEqual(get(applicant, 'type'), 'person') && <Flex justify={'flex-end'}>
                                            <Field
                                                className={'mr-16'} style={{width: 75}}
                                                property={{
                                                    hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                    onChange: (val) => setApplicant(prev => ({
                                                        ...prev,
                                                        seria: upperCase(val)
                                                    }))
                                                }}
                                                name={'applicant.person.passportData.seria'}
                                                type={'input-mask'}
                                            />
                                            <Field property={{
                                                hideLabel: true,
                                                mask: '9999999',
                                                placeholder: '1234567',
                                                maskChar: '_',
                                                onChange: (val) => setApplicant(prev => ({...prev, number: val}))
                                            }} name={'applicant.person.passportData.number'}
                                                   type={'input-mask'}/>

                                            <Field className={'ml-15'}
                                                   property={{
                                                       hideLabel: true,
                                                       placeholder: 'Дата рождения',
                                                       onChange: (e) => setApplicant(prev => ({...prev, birthDate: e}))
                                                   }}
                                                   name={'applicant.person.birthDate'} type={'datepicker'}/>
                                            <Button onClick={() => getInfo('applicant')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                        {isEqual(get(applicant, 'type'), 'organization') && <Flex justify={'flex-end'}>
                                            <Field
                                                onChange={(e) => setApplicant(prev => ({...prev, inn: e.target.value}))}
                                                property={{
                                                    hideLabel: true,
                                                    mask: '999999999',
                                                    placeholder: 'Inn',
                                                    maskChar: '_'
                                                }} name={'applicant.organization.inn'} type={'input-mask'}/>

                                            <Button onClick={() => getOrgInfo('applicant')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            {isEqual(get(applicant, 'type'), 'person') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(applicant, 'person.lastNameLatin')}
                                           label={'Lastname'}
                                           type={'input'}
                                           name={'applicant.person.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(applicant, 'person.firstNameLatin')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'applicant.person.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(applicant, 'person.middleNameLatin')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'applicant.person.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicant, 'person.startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'applicant.person.passportData.startDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicant, 'person.issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'applicant.person.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(applicant, 'person.gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'applicant.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(applicant, 'person.pinfl')}
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
                                        defaultValue={get(applicant, 'person.phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        property={{placeholder: '998XXXXXXXXX'}}
                                        name={'applicant.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(applicant, 'person.email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'applicant.person.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={residentTypeList}
                                        defaultValue={get(applicant, 'person.residentType')}
                                        label={'Resident type'}
                                        type={'select'}
                                        name={'applicant.person.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        label={'Серия вод. удостоверения'}
                                        type={'input'}
                                        name={'applicant.person.driverLicenseSeria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        label={'Номер вод. удостоверения'}
                                        type={'input'}
                                        name={'applicant.person.driverLicenseNumber'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(applicant, 'person.birthCountry')}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'applicant.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={regionList}
                                        defaultValue={get(applicant, 'person.regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'applicant.person.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={applicantDistrictList}
                                        defaultValue={get(applicant, 'person.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'applicant.person.districtId'}/>
                                </Col>

                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(applicant, 'person.address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'applicant.person.address'}/>
                                </Col>
                            </>}
                            {isEqual(get(applicant, 'type'), 'organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicant, 'organization.name')}
                                           label={'Наименование'} type={'input'}
                                           name={'applicant.organization.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Руководитель'} type={'input'}
                                           name={'applicant.organization.representativeName'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Должность'} type={'input'}
                                           name={'applicant.organization.position'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(applicant, 'organization.email')} label={'Email'}
                                           type={'input'}
                                           name={'applicant.organization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(applicant, 'organization.phone')} params={{
                                        required: true,
                                        pattern: {
                                            value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                            message: 'Invalid format'
                                        }
                                    }}
                                           property={{placeholder: '998XXXXXXXXX'}}
                                           label={'Телефон'} type={'input'}
                                           name={'applicant.organization.phone'}/>
                                </Col>
                                <Col xs={3}><Field defaultValue={parseInt(get(applicant, 'organization.oked'))}
                                                   label={'Oked'} params={{required: true, valueAsString: true}}
                                                   options={okedList}
                                                   type={'select'}
                                                   name={'applicant.organization.oked'}/></Col>

                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Расчетный счет'} type={'input'}
                                           name={'applicant.organization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field label={'Форма собственности'}
                                                   options={ownershipFormList}
                                                   type={'select'}
                                                   name={'applicant.organization.ownershipFormId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(applicant, 'organization.birthCountry', 210)}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'applicant.organization.countryId'}/>
                                </Col>
                                <Col xs={3}><Field label={'Область'} params={{required: true}} options={regionList}
                                                   type={'select'}
                                                   name={'applicant.organization.regionId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={applicantDistrictList}
                                        defaultValue={get(applicant, 'organization.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'applicant.organization.districtId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(applicant, 'organization.address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'applicant.organization.address'}/>
                                </Col>
                            </>}
                        </Row>

                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-25'}><Title>Лицо, ответственное за причиненный
                                вред</Title></Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={4}>
                                        <Flex>
                                            <h4 className={'mr-16'}>Лицо, ответственное за причиненный вред </h4>
                                            <Button onClick={() => setResponsible(prev => ({...prev, type: 'person'}))}
                                                    gray={!isEqual(get(responsible, 'type'), 'person')}
                                                    className={'mr-16'}
                                                    type={'button'}>Физ. лицо</Button>
                                            <Button onClick={() => setResponsible(prev => ({
                                                ...prev,
                                                type: 'organization'
                                            }))}
                                                    gray={!isEqual(get(responsible, 'type'), 'organization')}
                                                    type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {isEqual(get(responsible, 'type'), 'person') && <Flex justify={'flex-end'}>
                                            <Field
                                                className={'mr-16'} style={{width: 75}}
                                                property={{
                                                    hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                    onChange: (val) => setResponsible(prev => ({
                                                        ...prev,
                                                        seria: upperCase(val)
                                                    }))
                                                }}
                                                name={'responsibleForDamage.person.passportData.seria'}
                                                type={'input-mask'}
                                            />
                                            <Field property={{
                                                hideLabel: true,
                                                mask: '9999999',
                                                placeholder: '1234567',
                                                maskChar: '_',
                                                onChange: (val) => setResponsible(prev => ({...prev, number: val}))
                                            }} name={'responsibleForDamage.person.passportData.number'}
                                                   type={'input-mask'}/>

                                            <Field className={'ml-15'}
                                                   property={{
                                                       hideLabel: true,
                                                       placeholder: 'Дата рождения',
                                                       onChange: (e) => setResponsible(prev => ({
                                                           ...prev,
                                                           birthDate: e
                                                       }))
                                                   }}
                                                   name={'responsibleForDamage.person.birthDate'} type={'datepicker'}/>
                                            <Button onClick={() => getInfo('responsible')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                        {isEqual(get(responsible, 'type'), 'organization') &&
                                            <Flex justify={'flex-end'}>
                                                <Field onChange={(e) => setResponsible(prev => ({
                                                    ...prev,
                                                    inn: e.target.value
                                                }))} property={{
                                                    hideLabel: true,
                                                    mask: '999999999',
                                                    placeholder: 'Inn',
                                                    maskChar: '_'
                                                }} name={'responsibleForDamage.organization.inn'} type={'input-mask'}/>

                                                <Button onClick={() => getOrgInfo('responsible')} className={'ml-15'}
                                                        type={'button'}>Получить
                                                    данные</Button>
                                            </Flex>}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            {isEqual(get(responsible, 'type'), 'person') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(responsible, 'person.lastNameLatin')}
                                           label={'Lastname'}
                                           type={'input'}
                                           name={'responsibleForDamage.person.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(responsible, 'person.firstNameLatin')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'responsibleForDamage.person.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(responsible, 'person.middleNameLatin')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'responsibleForDamage.person.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsible, 'person.startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'responsibleForDamage.person.passportData.startDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsible, 'person.issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'responsibleForDamage.person.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(responsible, 'person.gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'responsibleForDamage.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(responsible, 'person.pinfl')}
                                           label={'ПИНФЛ'} type={'input'}
                                           name={'responsibleForDamage.person.passportData.pinfl'}/>
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
                                        defaultValue={get(responsible, 'person.phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        property={{placeholder: '998XXXXXXXXX'}}
                                        name={'responsibleForDamage.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(responsible, 'person.email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'responsibleForDamage.person.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={residentTypeList}
                                        defaultValue={get(responsible, 'person.residentType')}
                                        label={'Resident type'}
                                        type={'select'}
                                        name={'responsibleForDamage.person.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        label={'Серия вод. удостоверения'}
                                        type={'input'}
                                        name={'responsibleForDamage.person.driverLicenseSeria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        label={'Номер вод. удостоверения'}
                                        type={'input'}
                                        name={'responsibleForDamage.person.driverLicenseNumber'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(responsible, 'person.birthCountry')}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'responsibleForDamage.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={regionList}
                                        defaultValue={get(responsible, 'person.regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'responsibleForDamage.person.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={responsibleDistrictList}
                                        defaultValue={get(responsible, 'person.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleForDamage.person.districtId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(responsible, 'person.address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'responsibleForDamage.person.address'}/>
                                </Col>

                            </>}
                            {isEqual(get(responsible, 'type'), 'organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(responsible, 'organization.name')}
                                           label={'Наименование'} type={'input'}
                                           name={'responsibleForDamage.organization.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Руководитель'} type={'input'}
                                           name={'responsibleForDamage.organization.representativeName'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Должность'} type={'input'}
                                           name={'responsibleForDamage.organization.position'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(responsible, 'organization.email')} label={'Email'}
                                           type={'input'}
                                           name={'responsibleForDamage.organization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(responsible, 'organization.phone')} params={{
                                        required: true,
                                        pattern: {
                                            value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                            message: 'Invalid format'
                                        }
                                    }}
                                           property={{placeholder: '998XXXXXXXXX'}}
                                           label={'Телефон'} type={'input'}
                                           name={'responsibleForDamage.organization.phone'}/>
                                </Col>
                                <Col xs={3}><Field defaultValue={parseInt(get(responsible, 'organization.oked'))}
                                                   label={'Oked'} params={{required: true, valueAsString: true}}
                                                   options={okedList}
                                                   type={'select'}
                                                   name={'responsibleForDamage.organization.oked'}/></Col>

                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Расчетный счет'} type={'input'}
                                           name={'responsibleForDamage.organization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field label={'Форма собственности'}
                                                   options={ownershipFormList}
                                                   type={'select'}
                                                   name={'responsibleForDamage.organization.ownershipFormId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(responsible, 'organization.birthCountry', 210)}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'responsibleForDamage.organization.countryId'}/>
                                </Col>
                                <Col xs={3}><Field label={'Область'} params={{required: true}} options={regionList}
                                                   type={'select'}
                                                   name={'responsibleForDamage.organization.regionId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={responsibleDistrictList}
                                        defaultValue={get(responsible, 'organization.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleForDamage.organization.districtId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(responsible, 'organization.address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'responsibleForDamage.organization.address'}/>
                                </Col>

                            </>}
                        </Row>
                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-15'}><Title>ТС виновного лица:</Title></Col>

                            <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>
                                <div className={'mb-15'}>Государственный номер</div>
                                <div className={'mb-25'}><CarNumber getGovNumber={setGovNumber}/></div>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Серия тех.паспорта:</Col>
                                    <Col xs={7}><Field defaultValue={techPassportSeria} property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'responsibleVehicleInfo.techPassport.seria'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер тех.паспорта:</Col>
                                    <Col xs={7}><Field defaultValue={techPassportNumber} property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'responsibleVehicleInfo.techPassport.number'}/></Col>
                                </Row>
                                <Button type={'button'} onClick={getVehicleInfo} className={'w-100'}>Получить
                                    данные</Button>
                            </Col>
                            <Col xs={8}>
                                <Row>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'regionId')} options={regionList}
                                               label={'Территория пользования'}
                                               type={'select'}
                                               name={'responsibleVehicleInfo.regionId'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'modelName')} 
                                               label={'Марка / модель'}
                                               type={'input'}
                                               name={'responsibleVehicleInfo.modelCustomName'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'vehicleTypeId')} options={vehicleTypeList}
                                               label={'Вид транспорта'}
                                               type={'select'}
                                               name={'responsibleVehicleInfo.vehicleTypeId'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'issueYear')}
                                               property={{mask: '9999', maskChar: '_'}}
                                               label={'Год'}
                                               type={'input-mask'}
                                               name={'responsibleVehicleInfo.issueYear'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'bodyNumber')}
                                               label={'Номер кузова (шасси)'}
                                               type={'input'}
                                               name={'responsibleVehicleInfo.bodyNumber'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'engineNumber')}
                                               label={'Номер двигателя'}
                                               type={'input'}
                                               name={'responsibleVehicleInfo.engineNumber'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'fullWeight')}
                                               label={'Объем'}
                                               type={'input'}
                                               name={'responsibleVehicleInfo.fullWeight'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={parseInt(get(vehicle, 'seats'))}
                                               property={{type:'number'}}
                                               label={'Количество мест сидения'}
                                               type={'input'}
                                               name={'responsibleVehicleInfo.numberOfSeats'}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12} className={'mt-30'}><Checkbox checked={insurantIsOwner}
                                                                       onChange={(e) => setInsurantIsOwner(e.target.checked)}
                                                                       className={'mr-5'}/><strong>ТС владеет лицо, ответственное за вред</strong></Col>
                        </Row>

                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-25'}><Title>Владелец ТС</Title></Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={4}>
                                        <Flex>
                                            <h4 className={'mr-16'}>Лицо, ответственное за причиненный вред </h4>
                                            <Button onClick={() => setOwner(prev => ({...prev, type: 'person'}))}
                                                    gray={!isEqual(get(owner, 'type'), 'person')} className={'mr-16'}
                                                    type={'button'}>Физ. лицо</Button>
                                            <Button onClick={() => setOwner(prev => ({...prev, type: 'organization'}))}
                                                    gray={!isEqual(get(owner, 'type'), 'organization')} type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {isEqual(get(insurantIsOwner ? responsible : owner, 'type'), 'person') && <Flex justify={'flex-end'}>
                                            <Field
                                                defaultValue={get(insurantIsOwner ? responsible : owner,'person.passportData.seria')}
                                                className={'mr-16'} style={{width: 75}}
                                                property={{
                                                    hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                    onChange: (val) => setOwner(prev => ({
                                                        ...prev,
                                                        seria: upperCase(val)
                                                    }))
                                                }}
                                                name={'responsibleVehicleInfo.ownerPerson.passportData.seria'}
                                                type={'input-mask'}
                                            />
                                            <Field
                                                defaultValue={get(insurantIsOwner ? responsible : owner,'person.passportData.number')}
                                                property={{
                                                hideLabel: true,
                                                mask: '9999999',
                                                placeholder: '1234567',
                                                maskChar: '_',
                                                onChange: (val) => setOwner(prev => ({...prev, number: val}))
                                            }} name={'responsibleVehicleInfo.ownerPerson.passportData.number'}
                                                   type={'input-mask'}/>

                                            <Field className={'ml-15'}
                                                   defaultValue={get(insurantIsOwner ? responsible : owner,'person.passportData.birthDate')}
                                                   property={{
                                                       hideLabel: true,
                                                       placeholder: 'Дата рождения',
                                                       onChange: (e) => setOwner(prev => ({...prev, birthDate: e}))
                                                   }}
                                                   name={'responsibleVehicleInfo.ownerPerson.birthDate'}
                                                   type={'datepicker'}/>
                                            <Button onClick={() => getInfo('owner')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                        {isEqual(get(insurantIsOwner ? responsible : owner, 'type'), 'organization') && <Flex justify={'flex-end'}>
                                            <Field onChange={(e) => setOwner(prev => ({...prev, inn: e.target.value}))}
                                                   property={{
                                                       hideLabel: true,
                                                       mask: '999999999',
                                                       placeholder: 'Inn',
                                                       maskChar: '_'
                                                   }} name={'responsibleVehicleInfo.ownerOrganization.inn'}
                                                   type={'input-mask'}/>

                                            <Button onClick={() => getOrgInfo('owner')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            {isEqual(get(owner, 'type'), 'person') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                           defaultValue={get(insurantIsOwner ? responsible : owner, 'person.lastNameLatin')}
                                           label={'Lastname'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.ownerPerson.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                           defaultValue={get(insurantIsOwner ? responsible : owner, 'person.firstNameLatin')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.ownerPerson.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                           defaultValue={get(insurantIsOwner ? responsible : owner, 'person.middleNameLatin')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.ownerPerson.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field  defaultValue={get(insurantIsOwner ? responsible : owner, 'person.startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'responsibleVehicleInfo.ownerPerson.passportData.startDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field  defaultValue={get(insurantIsOwner ? responsible : owner, 'person.issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.ownerPerson.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? responsible : owner, 'person.gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.ownerPerson.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(insurantIsOwner ? responsible : owner, 'person.pinfl')}
                                           label={'ПИНФЛ'} type={'input'}
                                           name={'responsibleVehicleInfo.ownerPerson.passportData.pinfl'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{
                                            pattern: {
                                                value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                                message: 'Invalid format'
                                            }
                                        }}
                                        defaultValue={get(insurantIsOwner ? responsible : owner, 'person.phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        property={{placeholder: '998XXXXXXXXX'}}
                                        name={'responsibleVehicleInfo.ownerPerson.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? responsible : owner, 'person.email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.ownerPerson.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        options={residentTypeList}
                                        defaultValue={get(insurantIsOwner ? responsible : owner, 'person.residentType')}
                                        label={'Resident type'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.ownerPerson.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        label={'Серия вод. удостоверения'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.ownerPerson.driverLicenseSeria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        label={'Номер вод. удостоверения'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.ownerPerson.driverLicenseNumber'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? responsible : owner, 'person.birthCountry')}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'responsibleVehicleInfo.ownerPerson.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        options={regionList}
                                        defaultValue={get(insurantIsOwner ? responsible : owner, 'person.regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.ownerPerson.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        options={ownerDistrictList}
                                        defaultValue={get(insurantIsOwner ? responsible : owner, 'person.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.ownerPerson.districtId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        defaultValue={get(insurantIsOwner ? responsible : owner, 'person.address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.ownerPerson.address'}/>
                                </Col>
                            </>}
                            {isEqual(get(insurantIsOwner ? responsible : owner, 'type'), 'organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field  defaultValue={get(insurantIsOwner ? responsible : owner, 'organization.name')}
                                           label={'Наименование'} type={'input'}
                                           name={'responsibleVehicleInfo.ownerOrganization.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Руководитель'} type={'input'}
                                           name={'responsibleVehicleInfo.ownerOrganization.representativeName'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Должность'} type={'input'}
                                           name={'responsibleVehicleInfo.ownerOrganization.position'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(insurantIsOwner ? responsible : owner, 'organization.email')} label={'Email'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.ownerOrganization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(insurantIsOwner ? responsible : owner, 'organization.phone')} params={{
                                        pattern: {
                                            value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                            message: 'Invalid format'
                                        }
                                    }}
                                           property={{placeholder: '998XXXXXXXXX'}}
                                           label={'Телефон'} type={'input'}
                                           name={'responsibleVehicleInfo.ownerOrganization.phone'}/>
                                </Col>
                                <Col xs={3}><Field defaultValue={parseInt(get(insurantIsOwner ? responsible : owner, 'organization.oked'))}
                                                   label={'Oked'} params={{valueAsString: true}}
                                                   options={okedList}
                                                   type={'select'}
                                                   name={'responsibleVehicleInfo.ownerOrganization.oked'}/></Col>

                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Расчетный счет'} type={'input'}
                                           name={'responsibleVehicleInfo.ownerOrganization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field label={'Форма собственности'}
                                                   options={ownershipFormList}
                                                   type={'select'}
                                                   name={'responsibleVehicleInfo.ownerOrganization.ownershipFormId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(insurantIsOwner ? responsible : owner, 'organization.birthCountry', 210)}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'responsibleVehicleInfo.ownerOrganization.countryId'}/>
                                </Col>
                                <Col xs={3}><Field label={'Область'}  options={regionList}
                                                   type={'select'}
                                                   name={'responsibleVehicleInfo.ownerOrganization.regionId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        options={ownerDistrictList}
                                        defaultValue={get(insurantIsOwner ? responsible : owner, 'organization.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.ownerOrganization.districtId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        defaultValue={get(insurantIsOwner ? responsible : owner, 'organization.address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.ownerOrganization.address'}/>
                                </Col>

                            </>}
                        </Row>


                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-15'}><Title>Вред жизни(Потерпевшие)</Title></Col>
                            <Col xs={12}>
                                <Flex justify={'flex-end'}>
                                    <Button
                                        onClick={() => setVisibleLifeDamage(true)} className={'ml-15'}
                                        type={'button'}>Добавить</Button></Flex>
                            </Col>
                            <Col xs={12}>
                                <div className={'horizontal-scroll mt-15 mb-25'}>
                                    <Table bordered hideThead={false}
                                           thead={['№ ', 'ПИНФЛ', 'Фамилия', 'Имя', 'Отчество', 'Action']}>
                                        {
                                            get(lifeDamage, 'list', []).map((item, index) => <tr>

                                                <td>{index + 1}</td>
                                                <td>{get(item, 'lifeDamage.person.passportData.pinfl')}</td>
                                                <td>{get(item, 'lifeDamage.person.fullName.lastname')}</td>
                                                <td>{get(item, 'lifeDamage.person.fullName.firstname')}</td>
                                                <td>{get(item, 'lifeDamage.person.fullName.middlename')}</td>
                                                <td><Trash2
                                                    onClick={() => setLifeDamage((prev => ({
                                                        ...prev,
                                                        list: get(prev, 'list', []).filter((d, i) => i != index)
                                                    })))}
                                                    className={'cursor-pointer'} color={'red'}/></td>
                                            </tr>)
                                        }
                                    </Table>
                                </div>
                            </Col>
                        </Row>

                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-15'}><Title>Вред здоровью(Потерпевшие)</Title></Col>
                            <Col xs={12}>
                                <Flex justify={'flex-end'}>
                                    <Button
                                        onClick={() => setVisibleHealthDamage(true)} className={'ml-15'}
                                        type={'button'}>Добавить</Button></Flex>
                            </Col>
                            <Col xs={12}>
                                <div className={'horizontal-scroll mt-15 mb-25'}>
                                    <Table bordered hideThead={false}
                                           thead={['№ ', 'ПИНФЛ', 'Фамилия', 'Имя', 'Отчество', 'Action']}>
                                        {
                                            get(healthDamage, 'list', []).map((item, index) => <tr>

                                                <td>{index + 1}</td>
                                                <td>{get(item, 'healthDamage.person.passportData.pinfl')}</td>
                                                <td>{get(item, 'healthDamage.person.fullName.lastname')}</td>
                                                <td>{get(item, 'healthDamage.person.fullName.firstname')}</td>
                                                <td>{get(item, 'healthDamage.person.fullName.middlename')}</td>

                                                <td><Trash2
                                                    onClick={() => setHealthDamage((prev => ({
                                                        ...prev,
                                                        list: get(prev, 'list', []).filter((d, i) => i != index)
                                                    })))}
                                                    className={'cursor-pointer'} color={'red'}/></td>
                                            </tr>)
                                        }
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-15'}><Title>Вред ТС(Пострадавшие ТС)</Title></Col>
                            <Col xs={12}>
                                <Flex justify={'flex-end'}>
                                    <Button
                                        onClick={() => setVisible(true)} className={'ml-15'}
                                        type={'button'}>Добавить</Button></Flex>
                            </Col>
                            <Col xs={12}>
                                <div className={'horizontal-scroll mt-15 mb-25'}>
                                    <Table bordered hideThead={false}
                                           thead={['№ ', 'Гос.номер', 'Модель', 'Серия тех.паспорта', 'Номер тех.паспорта', 'Action']}>
                                        {
                                            get(vehicleDamage, 'list', []).map((item, index) => <tr>
                                                <td>{index + 1}</td>
                                                <td>{get(item, 'vehicleDamage.vehicle.govNumber')}</td>
                                                <td>{get(item, 'vehicleDamage.vehicle.modelCustomName')}</td>
                                                <td>{get(item, 'vehicleDamage.vehicle.techPassport.seria')}</td>
                                                <td>{get(item, 'vehicleDamage.vehicle.techPassport.number')}</td>
                                                <td><Trash2
                                                    onClick={() => setVehicleDamage((prev => ({
                                                        ...prev,
                                                        list: get(prev, 'list', []).filter((d, i) => i != index)
                                                    })))}
                                                    className={'cursor-pointer'} color={'red'}/></td>
                                            </tr>)
                                        }
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={8} className={'mb-15'}><Title>Вред иному имуществу(Пострадавшее имущество)</Title></Col>
                            <Col xs={4} className={'mb-15'}></Col>
                            <Col xs={12}>
                                <Flex justify={'flex-end'}>
                                    <Button
                                        onClick={() => setVisibleOtherPropertyDamage(true)}
                                        className={'ml-15'}
                                        type={'button'}>Добавить</Button></Flex>
                            </Col>
                            <Col xs={12}>
                                <div className={'horizontal-scroll mt-15 mb-25'}>
                                    <Table bordered hideThead={false}
                                           thead={['№ ', 'Описание имущества', 'Размер вреда', 'Action']}>
                                        {
                                            get(propertyDamage, 'list', []).map((item, index) => <tr>
                                                <td>{index + 1}</td>
                                                <td>{get(item, 'otherPropertyDamage.property')}</td>
                                                <td>{get(item, 'otherPropertyDamage.claimedDamage')}</td>
                                                <td><Trash2
                                                    onClick={() => setPropertyDamage((prev => ({
                                                        ...prev,
                                                        list: get(prev, 'list', []).filter((d, i) => i != index)
                                                    })))}
                                                    className={'cursor-pointer'} color={'red'}/></td>
                                            </tr>)
                                        }
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Modal title={'Добавление пострадавшее TC'} hide={() => setVisible(false)} visible={visible}>
                {(isLoadingVehicleInfo || isLoadingPersonalInfo || isLoadingOrganizationInfo) && <OverlayLoader/>}
                <Form
                    formRequest={({data: item}) => {
                        setVehicleDamage(prev => ({...prev, list: [...get(prev, 'list', []), item]}));
                        setVisible(false)
                    }}
                    getValueFromField={(value, name) => getFieldData(name, value)}
                    footer={<Flex className={'mt-32'}><Button>Добавить</Button></Flex>}>
                    <Row align={'end'}>
                        <Col xs={12} className={' mt-15'}>
                            <Row>
                                <Col xs={3}>
                                    <Field params={{required: true}}
                                           label={'Заявленный размер вреда'}
                                           type={'input'}
                                           name={'vehicleDamage.claimedDamage'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field

                                        label={'ИНН оценщика'}
                                        property={{
                                            mask: '999999999',
                                            maskChar: '_'
                                        }}
                                        type={'input-mask'}
                                        name={'vehicleDamage.appraiserInn'}/>
                                </Col>

                                <Col xs={3}>
                                    <Field
                                        label={'Номер отчёта оценщика'}
                                        type={'input'}
                                        name={'vehicleDamage.appraiserReportNumber'}/>
                                </Col> <Col xs={3}>
                                <Field
                                    label={'Дата отчёта оценщика'}
                                    type={'datepicker'}
                                    name={'vehicleDamage.appraiserReportDate'}/>
                            </Col>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            <hr className={'mt-15'}/>
                        </Col>
                        <Col xs={9} className={' mt-15'}>
                            <Flex align={'items-end'}>
                                <Field params={{required: true}} onChange={(e) => setVehicleDamage(prev => ({
                                    ...prev,
                                    govNumber: e.target.value
                                }))}
                                       className={'mr-16'}
                                       label={'Гос.номер'}
                                       name={'vehicleDamage.vehicle.govNumber'}
                                       type={'input'}
                                />
                                <Field params={{required: true}} className={'mr-16'}
                                       onChange={(e) => setVehicleDamage(prev => ({
                                           ...prev,
                                           techSeria: e.target.value
                                       }))}
                                       name={'vehicleDamage.vehicle.techPassport.seria'}
                                       type={'input'}
                                       label={'Серия тех.паспорта'}
                                />

                                <Field params={{required: true}} onChange={(e) => setVehicleDamage(prev => ({
                                    ...prev,
                                    techNumber: e.target.value
                                }))}
                                       name={'vehicleDamage.vehicle.techPassport.number'} type={'input'}
                                       label={'Номер тех.паспорта'}
                                />

                            </Flex></Col>
                        <Col xs={3}>
                            <Button onClick={() => getVehicleInfo('vehicleDamage')} className={'ml-15'}
                                    type={'button'}>Получить
                                данные</Button>
                        </Col>

                        <Col xs={12}>
                            <hr className={'mt-15'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   options={vehicleTypeList}
                                   defaultValue={get(vehicleDamage, 'vehicle.vehicleTypeId', 0)} label={'Вид ТС'}
                                   type={'select'}
                                   name={'vehicleDamage.vehicle.vehicleTypeId'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   defaultValue={get(vehicleDamage, 'vehicle.modelName')} label={'Модель ТС'}
                                   type={'input'}
                                   name={'vehicleDamage.vehicle.modelCustomName'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   defaultValue={get(vehicleDamage, 'vehicle.bodyNumber')}
                                   label={'Номер кузова (шасси)'}
                                   type={'input'}
                                   name={'vehicleDamage.vehicle.bodyNumber'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{valueAsNumber: true}}
                                defaultValue={get(vehicleDamage, 'vehicle.liftingCapacity', 0)}
                                label={'Грузоподъемность'}
                                property={{type: 'number'}}
                                type={'input'}
                                name={'vehicleDamage.vehicle.liftingCapacity'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{valueAsNumber: true}}
                                defaultValue={get(vehicleDamage, 'vehicle.seats')} label={'Количество мест сидения'}
                                property={{type: 'number', max: 1000}}
                                type={'input'}
                                name={'vehicleDamage.vehicle.numberOfSeats'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}} defaultValue={get(vehicleDamage, 'vehicle.issueYear')}
                                   label={'Год выпуска'} type={'input'}
                                   name={'vehicleDamage.vehicle.issueYear'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field defaultValue={get(vehicleDamage, 'vehicle.engineNumber')}
                                   label={'Номер двигателя'} type={'input'}
                                   name={'vehicleDamage.vehicle.engineNumber'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                label={'Иностранный'} type={'switch'}
                                name={'vehicleDamage.vehicle.isForeign'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   options={regionList}
                                   defaultValue={get(vehicleDamage, 'vehicle.regionId')} label={'Регион регистрации'}
                                   type={'select'}
                                   name={'vehicleDamage.vehicle.regionId'}/>
                        </Col>

                        <Col xs={12}>
                            <hr className={'mt-15'}/>
                        </Col>
                        <Col xs={12} className='mt-15'>
                            <Row>
                                <Col xs={12}>
                                    <Flex>
                                        <h4 className={'mr-16'}>Владелец TC </h4>
                                        <Button onClick={() => setVehicleDamage(prev => ({...prev, type: 'person'}))}
                                                gray={!isEqual(get(vehicleDamage, 'type'), 'person')}
                                                className={'mr-16'}
                                                type={'button'}>Физ. лицо</Button>
                                        <Button
                                            onClick={() => setVehicleDamage(prev => ({...prev, type: 'organization'}))}
                                            gray={!isEqual(get(vehicleDamage, 'type'), 'organization')}
                                            type={'button'}>Юр.
                                            лицо</Button>
                                    </Flex>
                                </Col>
                                <Col xs={12} className='mt-15'>
                                    {isEqual(get(vehicleDamage, 'type'), 'person') && <Flex justify={''}>
                                        <Field
                                            className={'mr-16'} style={{width: 75}}
                                            property={{
                                                hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                onChange: (val) => setVehicleDamage(prev => ({
                                                    ...prev,
                                                    seria: upperCase(val)
                                                }))
                                            }}
                                            name={'vehicleDamage.vehicle.ownerPerson.passportData.seria'}
                                            type={'input-mask'}
                                        />
                                        <Field property={{
                                            hideLabel: true,
                                            mask: '9999999',
                                            placeholder: '1234567',
                                            maskChar: '_',
                                            onChange: (val) => setVehicleDamage(prev => ({...prev, number: val}))
                                        }} name={'vehicleDamage.vehicle.ownerPerson.passportData.number'}
                                               type={'input-mask'}/>

                                        <Field className={'ml-15'}
                                               property={{
                                                   hideLabel: true,
                                                   placeholder: 'Дата рождения',
                                                   onChange: (e) => setVehicleDamage(prev => ({...prev, birthDate: e}))
                                               }}
                                               name={'vehicleDamage.vehicle.ownerPerson.birthDate'}
                                               type={'datepicker'}/>
                                        <Button onClick={() => getInfo('vehicleDamage')} className={'ml-15'}
                                                type={'button'}>Получить
                                            данные</Button>
                                    </Flex>}
                                    {isEqual(get(vehicleDamage, 'type'), 'organization') &&
                                        <Flex justify={'flex-start'}>
                                            <Field onChange={(e) => setVehicleDamage(prev => ({
                                                ...prev,
                                                inn: e.target.value
                                            }))}
                                                   property={{
                                                       hideLabel: true,
                                                       mask: '999999999',
                                                       placeholder: 'Inn',
                                                       maskChar: '_'
                                                   }} name={'vehicleDamage.vehicle.ownerOrganization.inn'}
                                                   type={'input-mask'}/>

                                            <Button onClick={() => getOrgInfo('vehicleDamage')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            <hr className={'mt-15 mb-15'}/>
                        </Col>
                        {isEqual(get(vehicleDamage, 'type'), 'person') && <>
                            <Col xs={3} className={'mb-25'}>
                                <Field params={{required: true}}
                                       defaultValue={get(vehicleDamage, 'person.lastNameLatin')}
                                       label={'Lastname'}
                                       type={'input'}
                                       name={'vehicleDamage.vehicle.ownerPerson.fullName.lastname'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field params={{required: true}}
                                       defaultValue={get(vehicleDamage, 'person.firstNameLatin')}
                                       label={'Firstname'}
                                       type={'input'}
                                       name={'vehicleDamage.vehicle.ownerPerson.fullName.firstname'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field params={{required: true}}
                                       defaultValue={get(vehicleDamage, 'person.middleNameLatin')}
                                       label={'Middlename'}
                                       type={'input'}
                                       name={'vehicleDamage.vehicle.ownerPerson.fullName.middlename'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field params={{required: true}} defaultValue={get(vehicleDamage, 'person.startDate')}
                                       label={'Дата выдачи паспорта'}
                                       type={'datepicker'}
                                       name={'vehicleDamage.vehicle.ownerPerson.passportData.startDate'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field params={{required: true}} defaultValue={get(vehicleDamage, 'person.issuedBy')}
                                       label={'Кем выдан'}
                                       type={'input'}
                                       name={'vehicleDamage.vehicle.ownerPerson.passportData.issuedBy'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    defaultValue={get(vehicleDamage, 'person.gender')}
                                    options={genderList}
                                    label={'Gender'}
                                    type={'select'}
                                    name={'vehicleDamage.vehicle.ownerPerson.gender'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field defaultValue={get(vehicleDamage, 'person.pinfl')}
                                       label={'ПИНФЛ'} type={'input'}
                                       name={'vehicleDamage.vehicle.ownerPerson.passportData.pinfl'}/>
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
                                    defaultValue={get(vehicleDamage, 'person.phone')}
                                    label={'Phone'}
                                    type={'input'}
                                    property={{placeholder: '998XXXXXXXXX'}}
                                    name={'vehicleDamage.vehicle.ownerPerson.phone'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(vehicleDamage, 'person.email')}
                                    label={'Email'}
                                    type={'input'}
                                    name={'vehicleDamage.vehicle.ownerPerson.email'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    options={residentTypeList}
                                    defaultValue={get(vehicleDamage, 'person.residentType')}
                                    label={'Resident type'}
                                    type={'select'}
                                    name={'vehicleDamage.vehicle.ownerPerson.residentType'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    label={'Серия вод. удостоверения'}
                                    type={'input'}
                                    name={'vehicleDamage.vehicle.ownerPerson.driverLicenseSeria'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    label={'Номер вод. удостоверения'}
                                    type={'input'}
                                    name={'vehicleDamage.vehicle.ownerPerson.driverLicenseNumber'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(vehicleDamage, 'person.birthCountry')}
                                    label={'Country'}
                                    type={'select'}
                                    options={countryList}
                                    name={'vehicleDamage.vehicle.ownerPerson.countryId'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    options={regionList}
                                    defaultValue={get(vehicleDamage, 'person.regionId')}
                                    label={'Region'}
                                    type={'select'}
                                    name={'vehicleDamage.vehicle.ownerPerson.regionId'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    options={vehicleDamageDistrictList}
                                    defaultValue={get(vehicleDamage, 'person.districtId')}
                                    label={'District'}
                                    type={'select'}
                                    name={'vehicleDamage.vehicle.ownerPerson.districtId'}/>
                            </Col>

                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    noMaxWidth
                                    params={{required: true}}
                                    defaultValue={get(vehicleDamage, 'person.address')}
                                    label={'Address'}
                                    type={'input'}
                                    name={'vehicleDamage.vehicle.ownerPerson.address'}/>
                            </Col>
                        </>}
                        {isEqual(get(vehicleDamage, 'type'), 'organization') && <>
                            <Col xs={3} className={'mb-25'}>
                                <Field params={{required: true}} defaultValue={get(vehicleDamage, 'organization.name')}
                                       label={'Наименование'} type={'input'}
                                       name={'vehicleDamage.vehicle.ownerOrganization.name'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field label={'Руководитель'} type={'input'}
                                       name={'vehicleDamage.vehicle.ownerOrganization.representativeName'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field label={'Должность'} type={'input'}
                                       name={'vehicleDamage.vehicle.ownerOrganization.position'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field defaultValue={get(vehicleDamage, 'organization.email')} label={'Email'}
                                       type={'input'}
                                       name={'vehicleDamage.vehicle.ownerOrganization.email'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field defaultValue={get(vehicleDamage, 'organization.phone')} params={{
                                    required: true,
                                    pattern: {
                                        value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                        message: 'Invalid format'
                                    }
                                }}
                                       property={{placeholder: '998XXXXXXXXX'}}
                                       label={'Телефон'} type={'input'}
                                       name={'vehicleDamage.vehicle.ownerOrganization.phone'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}><Field
                                defaultValue={parseInt(get(vehicleDamage, 'organization.oked'))}
                                label={'Oked'} params={{required: true, valueAsString: true}}
                                options={okedList}
                                type={'select'}
                                name={'vehicleDamage.vehicle.ownerOrganization.oked'}/></Col>

                            <Col xs={3} className={'mb-25'}>
                                <Field label={'Расчетный счет'} type={'input'}
                                       name={'vehicleDamage.vehicle.ownerOrganization.checkingAccount'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}><Field label={'Форма собственности'}
                                                                   options={ownershipFormList}
                                                                   type={'select'}
                                                                   name={'vehicleDamage.vehicle.ownerOrganization.ownershipFormId'}/></Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    defaultValue={get(vehicleDamage, 'organization.birthCountry', 210)}
                                    label={'Country'}
                                    type={'select'}
                                    options={countryList}
                                    name={'vehicleDamage.vehicle.ownerOrganization.countryId'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}><Field label={'Область'} params={{required: true}}
                                                                   options={regionList}
                                                                   type={'select'}
                                                                   name={'vehicleDamage.vehicle.ownerOrganization.regionId'}/></Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    options={vehicleDamageDistrictList}
                                    defaultValue={get(vehicleDamage, 'organization.districtId')}
                                    label={'District'}
                                    type={'select'}
                                    name={'vehicleDamage.vehicle.ownerOrganization.districtId'}/>
                            </Col>
                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    noMaxWidth
                                    params={{required: true}}
                                    defaultValue={get(vehicleDamage, 'organization.address')}
                                    label={'Address'}
                                    type={'input'}
                                    name={'vehicleDamage.vehicle.ownerOrganization.address'}/>
                            </Col>
                        </>}
                    </Row>
                </Form>
            </Modal>


            <Modal title={'Добавление Потерпевшие'} hide={() => setVisibleLifeDamage(false)}
                   visible={visibleLifeDamage}>
                <Form
                    formRequest={({data: item}) => {
                        setLifeDamage(prev => ({...prev, list: [...get(prev, 'list', []), item]}));
                        setVisibleLifeDamage(false);
                    }}
                    getValueFromField={(value, name) => getFieldData(name, value)}
                    footer={<Flex className={'mt-16'}><Button>Добавить</Button></Flex>}>
                    {isLoadingPersonalInfo && <OverlayLoader/>}
                    <Row align={'end'}>
                        <Col xs={12} className={' mt-15'}>
                            <Flex justify={''}>
                                <Field
                                    className={'mr-16'} style={{width: 75}}
                                    property={{
                                        hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                        onChange: (val) => setLifeDamage(prev => ({...prev, seria: upperCase(val)}))
                                    }}
                                    name={'lifeDamage.person.passportData.seria'}
                                    type={'input-mask'}
                                />
                                <Field property={{
                                    hideLabel: true,
                                    mask: '9999999',
                                    placeholder: '1234567',
                                    maskChar: '_',
                                    onChange: (val) => setLifeDamage(prev => ({...prev, number: val}))
                                }} name={'lifeDamage.person.passportData.number'} type={'input-mask'}/>

                                <Field className={'ml-15'}
                                       property={{
                                           hideLabel: true,
                                           placeholder: 'Дата рождения',
                                           onChange: (e) => setLifeDamage(prev => ({...prev, birthDate: e}))
                                       }}
                                       name={'lifeDamage.person.birthDate'} type={'datepicker'}/>
                                <Button onClick={() => getInfo('lifeDamage')} className={'ml-15'}
                                        type={'button'}>Получить
                                    данные</Button>
                            </Flex></Col>

                        <Col xs={12}>
                            <hr className={'mt-15 mb-15'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   label={'Информация о свидетельстве смерти'}
                                   type={'input'}
                                   name={'lifeDamage.deathCertificate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   label={'Заявленный размер вреда'}
                                   type={'input'}
                                   name={'lifeDamage.claimedDamage'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}} defaultValue={get(lifeDamage, 'person.lastNameLatin')}
                                   label={'Lastname'}
                                   type={'input'}
                                   name={'lifeDamage.person.fullName.lastname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}} defaultValue={get(lifeDamage, 'person.firstNameLatin')}
                                   label={'Firstname'}
                                   type={'input'}
                                   name={'lifeDamage.person.fullName.firstname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}} defaultValue={get(lifeDamage, 'person.middleNameLatin')}
                                   label={'Middlename'}
                                   type={'input'}
                                   name={'lifeDamage.person.fullName.middlename'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}} defaultValue={get(lifeDamage, 'startDate')}
                                   label={'Дата выдачи паспорта'}
                                   type={'datepicker'}
                                   name={'lifeDamage.person.passportData.startDate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}} defaultValue={get(lifeDamage, 'person.issuedBy')}
                                   label={'Кем выдан'}
                                   type={'input'}
                                   name={'lifeDamage.person.passportData.issuedBy'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                defaultValue={get(lifeDamage, 'person.gender')}
                                options={genderList}
                                label={'Gender'}
                                type={'select'}
                                name={'lifeDamage.person.gender'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field defaultValue={get(lifeDamage, 'person.pinfl')}
                                   label={'ПИНФЛ'} type={'input'}
                                   name={'lifeDamage.person.passportData.pinfl'}/>
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
                                defaultValue={get(lifeDamage, 'person.phone')}
                                label={'Phone'}
                                type={'input'}
                                property={{placeholder: '998XXXXXXXXX'}}
                                name={'lifeDamage.person.phone'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(lifeDamage, 'person.email')}
                                label={'Email'}
                                type={'input'}
                                name={'lifeDamage.person.email'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                options={residentTypeList}
                                defaultValue={get(lifeDamage, 'person.residentType')}
                                label={'Resident type'}
                                type={'select'}
                                name={'lifeDamage.person.residentType'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                label={'Серия вод. удостоверения'}
                                type={'input'}
                                name={'lifeDamage.person.driverLicenseSeria'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                label={'Номер вод. удостоверения'}
                                type={'input'}
                                name={'lifeDamage.person.driverLicenseNumber'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(lifeDamage, 'person.birthCountry')}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                name={'lifeDamage.person.countryId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                options={regionList}
                                defaultValue={get(lifeDamage, 'person.regionId')}
                                label={'Region'}
                                type={'select'}
                                name={'lifeDamage.person.regionId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                options={lifeDamageDistrictList}
                                defaultValue={get(lifeDamage, 'person.districtId')}
                                label={'District'}
                                type={'select'}
                                name={'lifeDamage.person.districtId'}/>
                        </Col>

                        <Col xs={6} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                defaultValue={get(lifeDamage, 'person.address')}
                                label={'Address'}
                                type={'input'}
                                name={'lifeDamage.person.address'}/>
                        </Col>

                    </Row>
                </Form>
            </Modal>

            <Modal title={'Добавление Потерпевшие'} hide={() => setVisibleHealthDamage(false)}
                   visible={visibleHealthDamage}>
                <Form
                    formRequest={({data: item}) => {
                        setHealthDamage(prev => ({...prev, list: [...get(prev, 'list', []), item]}));
                        setVisibleHealthDamage(false);
                    }}
                    getValueFromField={(value, name) => getFieldData(name, value)}
                    footer={<Flex className={'mt-16'}><Button>Добавить</Button></Flex>}>
                    {isLoadingPersonalInfo && <OverlayLoader/>}
                    <Row align={'end'}>
                        <Col xs={12} className={' mt-15'}>
                            <Flex justify={''}>
                                <Field
                                    className={'mr-16'} style={{width: 75}}
                                    property={{
                                        hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                        onChange: (val) => setHealthDamage(prev => ({...prev, seria: upperCase(val)}))
                                    }}
                                    name={'healthDamage.person.passportData.seria'}
                                    type={'input-mask'}
                                />
                                <Field property={{
                                    hideLabel: true,
                                    mask: '9999999',
                                    placeholder: '1234567',
                                    maskChar: '_',
                                    onChange: (val) => setHealthDamage(prev => ({...prev, number: val}))
                                }} name={'healthDamage.person.passportData.number'} type={'input-mask'}/>

                                <Field className={'ml-15'}
                                       property={{
                                           hideLabel: true,
                                           placeholder: 'Дата рождения',
                                           onChange: (e) => setHealthDamage(prev => ({...prev, birthDate: e}))
                                       }}
                                       name={'healthDamage.person.birthDate'} type={'datepicker'}/>
                                <Button onClick={() => getInfo('healthDamage')} className={'ml-15'}
                                        type={'button'}>Получить
                                    данные</Button>
                            </Flex></Col>

                        <Col xs={12}>
                            <hr className={'mt-15 mb-15'}/>
                        </Col>

                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   label={'Заявленный размер вреда'}
                                   type={'input'}
                                   name={'healthDamage.claimedDamage'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   label={'Дата документа'}
                                   type={'datepicker'}
                                   name={'healthDamage.medicalConclusion.documentDate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   label={'Медицинское учреждение'}
                                   type={'input'}
                                   name={'healthDamage.medicalConclusion.medicalInstitution'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   label={'Наименование документа'}
                                   type={'input'}
                                   name={'healthDamage.medicalConclusion.documentName'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   label={'Номер документа'}
                                   type={'input'}
                                   name={'healthDamage.medicalConclusion.documentNumber'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}} defaultValue={get(healthDamage, 'person.lastNameLatin')}
                                   label={'Lastname'}
                                   type={'input'}
                                   name={'healthDamage.person.fullName.lastname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}} defaultValue={get(healthDamage, 'person.firstNameLatin')}
                                   label={'Firstname'}
                                   type={'input'}
                                   name={'healthDamage.person.fullName.firstname'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}} defaultValue={get(healthDamage, 'person.middleNameLatin')}
                                   label={'Middlename'}
                                   type={'input'}
                                   name={'healthDamage.person.fullName.middlename'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}} defaultValue={get(healthDamage, 'startDate')}
                                   label={'Дата выдачи паспорта'}
                                   type={'datepicker'}
                                   name={'healthDamage.person.passportData.startDate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}} defaultValue={get(healthDamage, 'person.issuedBy')}
                                   label={'Кем выдан'}
                                   type={'input'}
                                   name={'healthDamage.person.passportData.issuedBy'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                defaultValue={get(healthDamage, 'person.gender')}
                                options={genderList}
                                label={'Gender'}
                                type={'select'}
                                name={'healthDamage.person.gender'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field defaultValue={get(healthDamage, 'person.pinfl')}
                                   label={'ПИНФЛ'} type={'input'}
                                   name={'healthDamage.person.passportData.pinfl'}/>
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
                                defaultValue={get(healthDamage, 'person.phone')}
                                label={'Phone'}
                                type={'input'}
                                property={{placeholder: '998XXXXXXXXX'}}
                                name={'healthDamage.person.phone'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(healthDamage, 'person.email')}
                                label={'Email'}
                                type={'input'}
                                name={'healthDamage.person.email'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                options={residentTypeList}
                                defaultValue={get(healthDamage, 'person.residentType')}
                                label={'Resident type'}
                                type={'select'}
                                name={'healthDamage.person.residentType'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                label={'Серия вод. удостоверения'}
                                type={'input'}
                                name={'healthDamage.person.driverLicenseSeria'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                label={'Номер вод. удостоверения'}
                                type={'input'}
                                name={'healthDamage.person.driverLicenseNumber'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(healthDamage, 'person.birthCountry')}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                name={'healthDamage.person.countryId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                options={regionList}
                                defaultValue={get(healthDamage, 'person.regionId')}
                                label={'Region'}
                                type={'select'}
                                name={'healthDamage.person.regionId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                options={healthDamageDistrictList}
                                defaultValue={get(healthDamage, 'person.districtId')}
                                label={'District'}
                                type={'select'}
                                name={'healthDamage.person.districtId'}/>
                        </Col>

                        <Col xs={6} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                defaultValue={get(healthDamage, 'person.address')}
                                label={'Address'}
                                type={'input'}
                                name={'healthDamage.person.address'}/>
                        </Col>

                    </Row>
                </Form>
            </Modal>

            <Modal title={'Добавление Пострадавшее имущество'} hide={() => setVisibleOtherPropertyDamage(false)}
                   visible={visibleOtherPropertyDamage}>
                {(isLoadingVehicleInfo || isLoadingPersonalInfo || isLoadingOrganizationInfo) && <OverlayLoader/>}
                <Form
                    formRequest={({data: item}) => {
                        setPropertyDamage(prev => ({...prev, list: [...get(prev, 'list', []), item]}));
                        setVisibleOtherPropertyDamage(false);
                    }}
                    getValueFromField={(value, name) => getFieldData(name, value)}
                    footer={<Flex className={'mt-16'}><Button>Добавить</Button></Flex>}>

                    <Row align={'end'}>
                        <Col xs={12} className={' mt-15'}>
                            <Row>
                                <Col xs={3}>
                                    <Field params={{required: true}}
                                           label={'Информация об имуществе'}
                                           type={'input'}
                                           name={'otherPropertyDamage.property'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field params={{required: true}}
                                           label={'Заявленный размер вреда'}
                                           type={'input'}
                                           name={'otherPropertyDamage.claimedDamage'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field

                                        label={'ИНН оценщика'}
                                        property={{
                                            mask: '999999999',
                                            maskChar: '_'
                                        }}
                                        type={'input-mask'}
                                        name={'otherPropertyDamage.appraiserInn'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        label={'Номер отчёта оценщика'}
                                        type={'input'}
                                        name={'otherPropertyDamage.appraiserReportNumber'}/>
                                </Col> <Col xs={3} className={'mt-15'}>
                                <Field
                                    label={'Дата отчёта оценщика'}
                                    type={'datepicker'}
                                    name={'otherPropertyDamage.appraiserReportDate'}/>
                            </Col>
                            </Row>
                        </Col>

                        <Col xs={12}>
                            <hr className={'mt-15'}/>
                        </Col>
                        <Col xs={12} className='mt-15'>
                            <Row>
                                <Col xs={12}>
                                    <Flex>
                                        <h4 className={'mr-16'}>Владелец имущества </h4>
                                        <Button onClick={() => setPropertyDamage(prev => ({...prev, type: 'person'}))}
                                                gray={!isEqual(get(propertyDamage, 'type'), 'person')}
                                                className={'mr-16'}
                                                type={'button'}>Физ. лицо</Button>
                                        <Button
                                            onClick={() => setPropertyDamage(prev => ({...prev, type: 'organization'}))}
                                            gray={!isEqual(get(propertyDamage, 'type'), 'organization')}
                                            type={'button'}>Юр.
                                            лицо</Button>
                                    </Flex>
                                </Col>
                                <Col xs={12} className='mt-15'>
                                    {isEqual(get(propertyDamage, 'type'), 'person') && <Flex justify={''}>
                                        <Field
                                            className={'mr-16'} style={{width: 75}}
                                            property={{
                                                hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                onChange: (val) => setPropertyDamage(prev => ({
                                                    ...prev,
                                                    seria: upperCase(val)
                                                }))
                                            }}
                                            name={'otherPropertyDamage.ownerPerson.passportData.seria'}
                                            type={'input-mask'}
                                        />
                                        <Field property={{
                                            hideLabel: true,
                                            mask: '9999999',
                                            placeholder: '1234567',
                                            maskChar: '_',
                                            onChange: (val) => setPropertyDamage(prev => ({...prev, number: val}))
                                        }} name={'otherPropertyDamage.ownerPerson.passportData.number'}
                                               type={'input-mask'}/>

                                        <Field className={'ml-15'}
                                               property={{
                                                   hideLabel: true,
                                                   placeholder: 'Дата рождения',
                                                   onChange: (e) => setPropertyDamage(prev => ({...prev, birthDate: e}))
                                               }}
                                               name={'otherPropertyDamage.ownerPerson.birthDate'} type={'datepicker'}/>
                                        <Button onClick={() => getInfo('propertyDamage')} className={'ml-15'}
                                                type={'button'}>Получить
                                            данные</Button>
                                    </Flex>}
                                    {isEqual(get(propertyDamage, 'type'), 'organization') &&
                                        <Flex justify={'flex-start'}>
                                            <Field onChange={(e) => setPropertyDamage(prev => ({
                                                ...prev,
                                                inn: e.target.value
                                            }))}
                                                   property={{
                                                       hideLabel: true,
                                                       mask: '999999999',
                                                       placeholder: 'Inn',
                                                       maskChar: '_'
                                                   }} name={'otherPropertyDamage.ownerOrganization.inn'}
                                                   type={'input-mask'}/>

                                            <Button onClick={() => getOrgInfo('propertyDamage')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            <hr className={'mt-15 mb-15'}/>
                        </Col>
                        {isEqual(get(propertyDamage, 'type'), 'person') && <>
                            <Col xs={3} className={'mb-25'}>
                                <Field params={{required: true}}
                                       defaultValue={get(propertyDamage, 'person.lastNameLatin')}
                                       label={'Lastname'}
                                       type={'input'}
                                       name={'otherPropertyDamage.ownerPerson.fullName.lastname'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field params={{required: true}}
                                       defaultValue={get(propertyDamage, 'person.firstNameLatin')}
                                       label={'Firstname'}
                                       type={'input'}
                                       name={'otherPropertyDamage.ownerPerson.fullName.firstname'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field params={{required: true}}
                                       defaultValue={get(propertyDamage, 'person.middleNameLatin')}
                                       label={'Middlename'}
                                       type={'input'}
                                       name={'otherPropertyDamage.ownerPerson.fullName.middlename'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field params={{required: true}} defaultValue={get(propertyDamage, 'person.startDate')}
                                       label={'Дата выдачи паспорта'}
                                       type={'datepicker'}
                                       name={'otherPropertyDamage.ownerPerson.passportData.startDate'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field params={{required: true}} defaultValue={get(propertyDamage, 'person.issuedBy')}
                                       label={'Кем выдан'}
                                       type={'input'}
                                       name={'otherPropertyDamage.ownerPerson.passportData.issuedBy'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    defaultValue={get(propertyDamage, 'person.gender')}
                                    options={genderList}
                                    label={'Gender'}
                                    type={'select'}
                                    name={'otherPropertyDamage.ownerPerson.gender'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field defaultValue={get(propertyDamage, 'person.pinfl')}
                                       label={'ПИНФЛ'} type={'input'}
                                       name={'otherPropertyDamage.ownerPerson.passportData.pinfl'}/>
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
                                    defaultValue={get(propertyDamage, 'person.phone')}
                                    label={'Phone'}
                                    type={'input'}
                                    property={{placeholder: '998XXXXXXXXX'}}
                                    name={'otherPropertyDamage.ownerPerson.phone'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(propertyDamage, 'person.email')}
                                    label={'Email'}
                                    type={'input'}
                                    name={'otherPropertyDamage.ownerPerson.email'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    options={residentTypeList}
                                    defaultValue={get(propertyDamage, 'person.residentType')}
                                    label={'Resident type'}
                                    type={'select'}
                                    name={'otherPropertyDamage.ownerPerson.residentType'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    label={'Серия вод. удостоверения'}
                                    type={'input'}
                                    name={'otherPropertyDamage.ownerPerson.driverLicenseSeria'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    label={'Номер вод. удостоверения'}
                                    type={'input'}
                                    name={'otherPropertyDamage.ownerPerson.driverLicenseNumber'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    defaultValue={get(propertyDamage, 'person.birthCountry')}
                                    label={'Country'}
                                    type={'select'}
                                    options={countryList}
                                    name={'otherPropertyDamage.ownerPerson.countryId'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    options={regionList}
                                    defaultValue={get(propertyDamage, 'person.regionId')}
                                    label={'Region'}
                                    type={'select'}
                                    name={'otherPropertyDamage.ownerPerson.regionId'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    options={propertyDamageDistrictList}
                                    defaultValue={get(propertyDamage, 'person.districtId')}
                                    label={'District'}
                                    type={'select'}
                                    name={'otherPropertyDamage.ownerPerson.districtId'}/>
                            </Col>

                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    noMaxWidth
                                    params={{required: true}}
                                    defaultValue={get(propertyDamage, 'person.address')}
                                    label={'Address'}
                                    type={'input'}
                                    name={'otherPropertyDamage.ownerPerson.address'}/>
                            </Col>
                        </>}
                        {isEqual(get(propertyDamage, 'type'), 'organization') && <>
                            <Col xs={3} className={'mb-25'}>
                                <Field params={{required: true}} defaultValue={get(propertyDamage, 'organization.name')}
                                       label={'Наименование'} type={'input'}
                                       name={'otherPropertyDamage.ownerOrganization.name'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field label={'Руководитель'} type={'input'}
                                       name={'otherPropertyDamage.ownerOrganization.representativeName'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field label={'Должность'} type={'input'}
                                       name={'otherPropertyDamage.ownerOrganization.position'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field defaultValue={get(propertyDamage, 'organization.email')} label={'Email'}
                                       type={'input'}
                                       name={'otherPropertyDamage.ownerOrganization.email'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field defaultValue={get(propertyDamage, 'organization.phone')} params={{
                                    required: true,
                                    pattern: {
                                        value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                        message: 'Invalid format'
                                    }
                                }}
                                       property={{placeholder: '998XXXXXXXXX'}}
                                       label={'Телефон'} type={'input'}
                                       name={'otherPropertyDamage.ownerOrganization.phone'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}><Field
                                defaultValue={parseInt(get(propertyDamage, 'organization.oked'))}
                                label={'Oked'} params={{required: true, valueAsString: true}}
                                options={okedList}
                                type={'select'}
                                name={'otherPropertyDamage.ownerOrganization.oked'}/></Col>

                            <Col xs={3} className={'mb-25'}>
                                <Field label={'Расчетный счет'} type={'input'}
                                       name={'otherPropertyDamage.ownerOrganization.checkingAccount'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}><Field label={'Форма собственности'}
                                                                   options={ownershipFormList}
                                                                   type={'select'}
                                                                   name={'otherPropertyDamage.ownerOrganization.ownershipFormId'}/></Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    defaultValue={get(propertyDamage, 'organization.birthCountry', 210)}
                                    label={'Country'}
                                    type={'select'}
                                    options={countryList}
                                    name={'otherPropertyDamage.ownerOrganization.countryId'}/>
                            </Col>
                            <Col xs={3} className={'mb-25'}><Field label={'Область'} params={{required: true}}
                                                                   options={regionList}
                                                                   type={'select'}
                                                                   name={'otherPropertyDamage.ownerOrganization.regionId'}/></Col>
                            <Col xs={3} className={'mb-25'}>
                                <Field
                                    options={propertyDamageDistrictList}
                                    defaultValue={get(propertyDamage, 'organization.districtId')}
                                    label={'District'}
                                    type={'select'}
                                    name={'otherPropertyDamage.ownerOrganization.districtId'}/>
                            </Col>
                            <Col xs={6} className={'mb-25'}>
                                <Field
                                    noMaxWidth
                                    params={{required: true}}
                                    defaultValue={get(propertyDamage, 'organization.address')}
                                    label={'Address'}
                                    type={'input'}
                                    name={'otherPropertyDamage.ownerOrganization.address'}/>
                            </Col>
                        </>}
                    </Row>
                </Form>
            </Modal>
        </Section>
    </>);
};

export default CreateContainer;