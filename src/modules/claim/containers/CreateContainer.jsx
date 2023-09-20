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
import NumberFormat from "react-number-format";
import CarNumber from "../../../components/car-number"

const CreateContainer = () => {
    const [applicant, setApplicant] = useState({
        type: 'person',
        inn: null,
        seria: null,
        number: null,
        person: null,
        organization: null,
        birthDate: null,
        regionId: null
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
    const [vehicleType, setVehicleType] = useState(null)
    const [otherParams, setOtherParams] = useState({})
    const [visibleLifeDamage, setVisibleLifeDamage] = useState(false);
    const [visibleOtherPropertyDamage, setVisibleOtherPropertyDamage] = useState(false);

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
                } : type == 'propertyDamage' ? {inn: get(propertyDamage, 'inn')} : {
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
                        setApplicant(prev => ({...prev, organization: get(data, 'result')}));
                    }
                }
            }
        )
    }

    const getVehicleInfo = () => {
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


    const getFieldData = (name, value) => {

        if (isEqual(name, 'regionId')) {
            setRegionId(value)
        }

        if (isEqual(name, 'owner.organization.regionId')) {
            setRegionId(value)
        }
        if (isEqual(name, 'owner.person.regionId')) {
            setRegionId(value)
        }
        if (isEqual(name, 'otherPropertyDamage.ownerPerson.regionId')) {
            setRegionId(value)
        }

        if (isEqual(name, 'vehicle.techPassport.number')) {
            setTechPassportNumber(value)
        }
        if (isEqual(name, 'vehicle.techPassport.seria')) {
            setTechPassportSeria(value)
        }
        if (isEqual(name, 'vehicle.typeId')) {
            setVehicleType(value)
        }

        setOtherParams(prev => ({...prev, [name]: value}))
    }

    const create = ({data}) => {
        const {
            insuranceSumForPassenger,
            passengerCapacity,
            birthDate,
            passportNumber,
            passportSeries,
            insurantPassportSeries,
            insurantPassportNumber,
            insurantBirthDate,
            rpmSum,
            inn,
            agentReward,
            insurantInn,
            insurant: insurantType,
            owner: ownerType,
            ...rest
        } = data
        createRequest({
                url: URLS.osgopCreate, attributes: {
                    agentReward: Number(agentReward),
                    regionId: isEqual(applicant, 'person') ? get(insurantType, 'person.regionId') : get(insurantType, 'organization.regionId'),
                    applicant: isEqual(false ? applicant : responsible, 'person') ? {person: get(ownerType, 'person', {})} : {
                        organization: {
                            ...get(ownerType, 'organization', {})
                        }
                    },
                    insurant: isEqual(applicant, 'person') ? {person: get(insurantType, 'person', {})} : {
                        organization: {
                            ...get(insurantType, 'organization', {})
                        }
                    },
                    ...rest
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

    console.log('propertyDamage', propertyDamage)

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
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
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
                                    <Col xs={7}><Field params={{required: true}} options={districtList}
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
                                                    gray={!isEqual(get(applicant,'type'), 'person')} className={'mr-16'}
                                                    type={'button'}>Физ. лицо</Button>
                                            <Button onClick={() => setApplicant(prev => ({
                                                ...prev,
                                                type: 'organization'
                                            }))}
                                                    gray={!isEqual(get(applicant,'type'), 'organization')} type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {isEqual(get(applicant,'type'), 'person') && <Flex justify={'flex-end'}>
                                            <Field
                                                className={'mr-16'} style={{width: 75}}
                                                property={{
                                                    hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                    onChange: (val) => setApplicant(prev => ({
                                                        ...prev,
                                                        seria: upperCase(val)
                                                    }))
                                                }}
                                                name={'applicant.person.passportData.passportSeries'}
                                                type={'input-mask'}
                                            />
                                            <Field property={{
                                                hideLabel: true,
                                                mask: '9999999',
                                                placeholder: '1234567',
                                                maskChar: '_',
                                                onChange: (val) => setApplicant(prev => ({...prev, number: val}))
                                            }} name={'applicant.person.passportData.passportNumber'}
                                                   type={'input-mask'}/>

                                            <Field className={'ml-15'}
                                                   property={{
                                                       hideLabel: true,
                                                       placeholder: 'Дата рождения',
                                                       onChange: (e) => setApplicant(prev => ({...prev, birthDate: e}))
                                                   }}
                                                   name={'birthDate'} type={'datepicker'}/>
                                            <Button onClick={() => getInfo('applicant')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                        {isEqual(get(applicant,'type'), 'organization') && <Flex justify={'flex-end'}>
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
                                        name={'insurant.person.gender'}/>
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
                                        options={districtList}
                                        defaultValue={get(applicant, 'person.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'applicant.person.districtId'}/>
                                </Col>

                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(applicant, 'address')}
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
                                                   name={'insurant.organization.ownershipFormId'}/></Col>
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
                                        options={districtList}
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
                                                    gray={!isEqual(get(responsible,'type'), 'person')} className={'mr-16'}
                                                    type={'button'}>Физ. лицо</Button>
                                            <Button onClick={() => setResponsible(prev => ({
                                                ...prev,
                                                type: 'organization'
                                            }))}
                                                    gray={!isEqual(get(responsible,'type'), 'organization')} type={'button'}>Юр.
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
                                        {isEqual(get(responsible,'type'), 'organization') && <Flex justify={'flex-end'}>
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
                                        options={districtList}
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
                                        options={districtList}
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
                                                       name={'vehicle.techPassport.seria'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер тех.паспорта:</Col>
                                    <Col xs={7}><Field defaultValue={techPassportNumber} property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'vehicle.techPassport.number'}/></Col>
                                </Row>
                                <Button type={'button'} onClick={getVehicleInfo} className={'w-100'}>Получить
                                    данные</Button>
                            </Col>
                            <Col xs={8}>
                                <Row>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'regionId')} options={regionList}
                                               params={{required: true}}
                                               label={'Территория пользования'}
                                               type={'select'}
                                               name={'vehicle.regionId'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'modelName')} params={{required: true}}
                                               label={'Марка / модель'}
                                               type={'input'}
                                               name={'vehicle.modelCustomName'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'vehicleTypeId')} options={vehicleTypeList}
                                               params={{required: true}}
                                               label={'Вид транспорта'}
                                               type={'select'}
                                               name={'vehicle.typeId'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'issueYear')}
                                               property={{mask: '9999', maskChar: '_'}} params={{required: true}}
                                               label={'Год'}
                                               type={'input-mask'}
                                               name={'vehicle.issueYear'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'bodyNumber')} params={{required: true}}
                                               label={'Номер кузова (шасси)'}
                                               type={'input'}
                                               name={'vehicle.bodyNumber'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'engineNumber')} params={{required: true}}
                                               label={'Номер двигателя'}
                                               type={'input'}
                                               name={'vehicle.engineNumber'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'fullWeight')} params={{required: true}}
                                               label={'Объем'}
                                               type={'input'}
                                               name={'vehicle.fullWeight'}/>
                                    </Col>
                                    <Col xs={4} className="mb-25">
                                        <Field defaultValue={get(vehicle, 'techPassportIssueDate')}
                                               params={{required: true}}
                                               label={'Дата выдачи тех.паспорта'}
                                               type={'datepicker'}
                                               name={'vehicle.techPassport.issueDate'}/>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-25'}><Title>Владелец ТС</Title></Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={4}>
                                        <Flex>
                                            <h4 className={'mr-16'}>Лицо, ответственное за причиненный вред </h4>
                                            <Button onClick={() => setOwner(prev=>({...prev,type:'person'}))}
                                                    gray={!isEqual(get(owner,'type'), 'person')} className={'mr-16'}
                                                    type={'button'}>Физ. лицо</Button>
                                            <Button onClick={() => setOwner(prev=>({...prev,type:'organization'}))}
                                                    gray={!isEqual(get(owner,'type'), 'organization')} type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {isEqual(get(owner,'type'), 'person') && <Flex justify={'flex-end'}>
                                            <Field
                                                className={'mr-16'} style={{width: 75}}
                                                property={{
                                                    hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                    onChange: (val) => setOwner(prev=>({...prev,seria: upperCase(val)}))
                                                }}
                                                name={'responsibleVehicleInfo.ownerPerson.passportData.seria'}
                                                type={'input-mask'}
                                            />
                                            <Field property={{
                                                hideLabel: true,
                                                mask: '9999999',
                                                placeholder: '1234567',
                                                maskChar: '_',
                                                onChange: (val) => setOwner(prev=>({...prev,number: val}))
                                            }} name={'responsibleVehicleInfo.ownerPerson.passportData.number'} type={'input-mask'}/>

                                            <Field className={'ml-15'}
                                                   property={{
                                                       hideLabel: true,
                                                       placeholder: 'Дата рождения',
                                                       onChange: (e) =>setOwner(prev=>({...prev,birthDate: e}))
                                                   }}
                                                   name={'responsibleVehicleInfo.ownerPerson.birthDate'} type={'datepicker'}/>
                                            <Button onClick={() => getInfo('owner')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                        {isEqual(responsible, 'organization') && <Flex justify={'flex-end'}>
                                            <Field onChange={(e) => setOwner(prev=>({...prev,inn:e.target.value}))} property={{
                                                hideLabel: true,
                                                mask: '999999999',
                                                placeholder: 'Inn',
                                                maskChar: '_'
                                            }} name={'responsibleVehicleInfo.ownerOrganization.inn'} type={'input-mask'}/>

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
                            {isEqual(get(owner,'type'), 'person') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(owner, 'person.lastNameLatin')}
                                           label={'Lastname'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.ownerPerson.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(owner, 'person.firstNameLatin')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.ownerPerson.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(owner, 'person.middleNameLatin')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.ownerPerson.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(owner, 'person.startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'responsibleVehicleInfo.ownerPerson.passportData.startDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(owner, 'person.issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.ownerPerson.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(owner, 'person.gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.ownerPerson.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(owner, 'person.pinfl')}
                                           label={'ПИНФЛ'} type={'input'}
                                           name={'responsibleVehicleInfo.ownerPerson.passportData.pinfl'}/>
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
                                        defaultValue={get(owner, 'person.phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        property={{placeholder: '998XXXXXXXXX'}}
                                        name={'responsibleForDamage.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(owner, 'person.email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.ownerPerson.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={residentTypeList}
                                        defaultValue={get(owner, 'person.residentType')}
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
                                        defaultValue={get(owner, 'person.birthCountry')}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'responsibleVehicleInfo.ownerPerson.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={regionList}
                                        defaultValue={get(owner, 'person.regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.ownerPerson.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(owner, 'person.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.ownerPerson.districtId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(owner, 'person.address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.ownerPerson.address'}/>
                                </Col>
                            </>}
                            {isEqual(get(owner,'type'), 'organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(owner, 'organization.name')}
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
                                    <Field defaultValue={get(owner, 'organization.email')} label={'Email'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.ownerOrganization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(owner, 'organization.phone')} params={{
                                        required: true,
                                        pattern: {
                                            value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                            message: 'Invalid format'
                                        }
                                    }}
                                           property={{placeholder: '998XXXXXXXXX'}}
                                           label={'Телефон'} type={'input'}
                                           name={'responsibleVehicleInfo.ownerOrganization.phone'}/>
                                </Col>
                                <Col xs={3}><Field defaultValue={parseInt(get(owner, 'organization.oked'))}
                                                   label={'Oked'} params={{required: true, valueAsString: true}}
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
                                        params={{required: true}}
                                        defaultValue={get(owner, 'organization.birthCountry', 210)}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'responsibleVehicleInfo.ownerOrganization.countryId'}/>
                                </Col>
                                <Col xs={3}><Field label={'Область'} params={{required: true}} options={regionList}
                                                   type={'select'}
                                                   name={'responsibleVehicleInfo.ownerOrganization.regionId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(owner, 'organization.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.ownerOrganization.districtId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(owner, 'organization.address')}
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
                                            [].map((item, index) => <tr>

                                                <td>{index + 1}</td>
                                                <td>{get(find(vehicleTypeList, (_vehicle) => get(_vehicle, 'value') == get(item, 'objects[0].vehicle.vehicleTypeId')), 'label', '-')}</td>
                                                <td>{get(item, 'objects[0].vehicle.modelCustomName')}</td>
                                                <td>{get(item, 'objects[0].vehicle.govNumber')}</td>
                                                <td><NumberFormat value={get(item, 'insurancePremium', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>
                                                <td><NumberFormat value={get(item, 'insuranceSum', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>

                                                <td><Trash2
                                                    onClick={() => console.log([].filter((d, i) => i != index))}
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
                                        onClick={() => setVisibleLifeDamage(true)} className={'ml-15'}
                                        type={'button'}>Добавить</Button></Flex>
                            </Col>
                            <Col xs={12}>
                                <div className={'horizontal-scroll mt-15 mb-25'}>
                                    <Table bordered hideThead={false}
                                           thead={['№ ', 'ПИНФЛ', 'Фамилия', 'Имя', 'Отчество', 'Action']}>
                                        {
                                            [].map((item, index) => <tr>

                                                <td>{index + 1}</td>
                                                <td>{get(find(vehicleTypeList, (_vehicle) => get(_vehicle, 'value') == get(item, 'objects[0].vehicle.vehicleTypeId')), 'label', '-')}</td>
                                                <td>{get(item, 'objects[0].vehicle.modelCustomName')}</td>
                                                <td>{get(item, 'objects[0].vehicle.govNumber')}</td>
                                                <td><NumberFormat value={get(item, 'insurancePremium', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>
                                                <td><NumberFormat value={get(item, 'insuranceSum', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>

                                                <td><Trash2
                                                    onClick={() => console.log([].filter((d, i) => i != index))}
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
                                            [].map((item, index) => <tr>
                                                <td>{index + 1}</td>
                                                <td>{get(find(vehicleTypeList, (_vehicle) => get(_vehicle, 'value') == get(item, 'objects[0].vehicle.vehicleTypeId')), 'label', '-')}</td>
                                                <td>{get(item, 'objects[0].vehicle.modelCustomName')}</td>
                                                <td>{get(item, 'objects[0].vehicle.govNumber')}</td>
                                                <td><NumberFormat value={get(item, 'insurancePremium', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>
                                                <td><NumberFormat value={get(item, 'insuranceSum', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>

                                                <td><Trash2
                                                    onClick={() => console.log([].filter((d, i) => i != index))}
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
                {isLoadingVehicleInfo && <OverlayLoader/>}
                <Form
                    formRequest={({data: item}) => {
                        if (!isEmpty(get(item, 'vehicle'))) {

                        }
                        setVisible(false)
                    }}
                    getValueFromField={(value, name) => getFieldData(name, value)}
                    footer={<Flex className={'mt-32'}><Button>Добавить</Button></Flex>}>
                    <Row align={'end'}>
                        <Col xs={9} className={' mt-15'}>
                            <Flex align={'items-end'}>
                                <Field params={{required: true}} onChange={(e) => setGovNumber(e.target.value)}
                                       className={'mr-16'}
                                       label={'Гос.номер'}
                                       name={'vehicle.objects[0].vehicle.govNumber'}
                                       type={'input'}
                                />
                                <Field params={{required: true}} className={'mr-16'}
                                       onChange={(e) => setTechPassportSeria(e.target.value)}
                                       name={'vehicle.objects[0].vehicle.techPassport.seria'}
                                       type={'input'}
                                       label={'Серия тех.паспорта'}
                                />

                                <Field params={{required: true}} onChange={(e) => setTechPassportNumber(e.target.value)}
                                       name={'vehicle.objects[0].vehicle.techPassport.number'} type={'input'}
                                       label={'Номер тех.паспорта'}
                                />

                            </Flex></Col>
                        <Col xs={3}>
                            <Button onClick={() => getVehicleInfo()} className={'ml-15'}
                                    type={'button'}>Получить
                                данные</Button>
                        </Col>
                        <Col xs={12}>
                            <hr className={'mt-15'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   options={vehicleTypeList}
                                   defaultValue={get(vehicle, 'vehicleTypeId', 0)} label={'Вид ТС'}
                                   type={'select'}
                                   name={'vehicle.objects[0].vehicle.vehicleTypeId'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   defaultValue={get(vehicle, 'modelName')} label={'Модель ТС'}
                                   type={'input'}
                                   name={'vehicle.objects[0].vehicle.modelCustomName'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   defaultValue={get(vehicle, 'bodyNumber')} label={'Номер кузова (шасси)'}
                                   type={'input'}
                                   name={'vehicle.objects[0].vehicle.bodyNumber'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{valueAsNumber: true}}
                                defaultValue={get(vehicle, 'liftingCapacity', 0)} label={'Грузоподъемность'}
                                property={{type: 'number'}}
                                type={'input'}
                                name={'vehicle.objects[0].vehicle.liftingCapacity'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                params={{valueAsNumber: true}}
                                defaultValue={get(vehicle, 'seats')} label={'Количество мест сидения'}
                                property={{type: 'number', max: 1000}}
                                type={'input'}
                                name={'vehicle.objects[0].vehicle.numberOfSeats'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}} defaultValue={get(vehicle, 'issueYear')}
                                   label={'Год выпуска'} type={'input'}
                                   name={'vehicle.objects[0].vehicle.issueYear'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field defaultValue={get(vehicle, 'engineNumber')}
                                   label={'Номер двигателя'} type={'input'}
                                   name={'vehicle.objects[0].vehicle.engineNumber'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field
                                label={'Иностранный'} type={'switch'}
                                name={'vehicle.objects[0].vehicle.isForeign'}/>
                        </Col>
                        <Col xs={4} className={'mt-15'}>
                            <Field params={{required: true}}
                                   options={regionList}
                                   defaultValue={get(vehicle, 'regionId')} label={'Регион регистрации'}
                                   type={'select'}
                                   name={'vehicle.objects[0].vehicle.regionId'}/>
                        </Col>

                    </Row>
                </Form>
            </Modal>

            <Modal title={'Добавление Потерпевшие'} hide={() => setVisibleLifeDamage(false)}
                   visible={visibleLifeDamage}>
                {isLoadingVehicleInfo && <OverlayLoader/>}
                {/*<Form*/}
                {/*    formRequest={({data: item}) => {*/}

                {/*    }}*/}
                {/*    getValueFromField={(value, name) => getFieldData(name, value)}*/}
                {/*    footer={<Flex className={'mt-16'}><Button>Добавить</Button></Flex>}>*/}
                {/*    <Row align={'end'}>*/}
                {/*        <Col xs={12} className={' mt-15'}>*/}
                {/*            <Flex justify={''}>*/}
                {/*                <Field*/}
                {/*                    className={'mr-16'} style={{width: 75}}*/}
                {/*                    property={{*/}
                {/*                        hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',*/}
                {/*                        onChange: (val) => setPassportSeries(upperCase(val))*/}
                {/*                    }}*/}
                {/*                    name={'passportSeries'}*/}
                {/*                    type={'input-mask'}*/}
                {/*                />*/}
                {/*                <Field property={{*/}
                {/*                    hideLabel: true,*/}
                {/*                    mask: '9999999',*/}
                {/*                    placeholder: '1234567',*/}
                {/*                    maskChar: '_',*/}
                {/*                    onChange: (val) => setPassportNumber(val)*/}
                {/*                }} name={'passportNumber'} type={'input-mask'}/>*/}

                {/*                <Field className={'ml-15'}*/}
                {/*                       property={{*/}
                {/*                           hideLabel: true,*/}
                {/*                           placeholder: 'Дата рождения',*/}
                {/*                           onChange: (e) => setBirthDate(e)*/}
                {/*                       }}*/}
                {/*                       name={'birthDate'} type={'datepicker'}/>*/}
                {/*                <Button onClick={() => getInfo('applicant')} className={'ml-15'}*/}
                {/*                        type={'button'}>Получить*/}
                {/*                    данные</Button>*/}
                {/*            </Flex></Col>*/}

                {/*        <Col xs={12}>*/}
                {/*            <hr className={'mt-15'}/>*/}
                {/*        </Col>*/}

                {/*        <Col xs={12} className={'mb-25'}><Title>Заявитель</Title></Col>*/}
                {/*        <Col xs={12}>*/}
                {/*            <Row>*/}
                {/*                <Col xs={4}>*/}
                {/*                    <Flex>*/}
                {/*                        <h4 className={'mr-16'}>Заявитель </h4>*/}
                {/*                        <Button onClick={() => setApplicant('person')}*/}
                {/*                                gray={!isEqual(applicant, 'person')} className={'mr-16'}*/}
                {/*                                type={'button'}>Физ. лицо</Button>*/}
                {/*                        <Button onClick={() => setApplicant('organization')}*/}
                {/*                                gray={!isEqual(applicant, 'organization')} type={'button'}>Юр.*/}
                {/*                            лицо</Button>*/}
                {/*                    </Flex>*/}
                {/*                </Col>*/}
                {/*                <Col xs={8} className={'text-right'}>*/}
                {/*                    {isEqual(applicant, 'person') && <Flex justify={'flex-end'}>*/}
                {/*                        <Field*/}
                {/*                            className={'mr-16'} style={{width: 75}}*/}
                {/*                            property={{*/}
                {/*                                hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',*/}
                {/*                                onChange: (val) => setPassportSeries(upperCase(val))*/}
                {/*                            }}*/}
                {/*                            name={'passportSeries'}*/}
                {/*                            type={'input-mask'}*/}
                {/*                        />*/}
                {/*                        <Field property={{*/}
                {/*                            hideLabel: true,*/}
                {/*                            mask: '9999999',*/}
                {/*                            placeholder: '1234567',*/}
                {/*                            maskChar: '_',*/}
                {/*                            onChange: (val) => setPassportNumber(val)*/}
                {/*                        }} name={'passportNumber'} type={'input-mask'}/>*/}

                {/*                        <Field className={'ml-15'}*/}
                {/*                               property={{*/}
                {/*                                   hideLabel: true,*/}
                {/*                                   placeholder: 'Дата рождения',*/}
                {/*                                   onChange: (e) => setBirthDate(e)*/}
                {/*                               }}*/}
                {/*                               name={'birthDate'} type={'datepicker'}/>*/}
                {/*                        <Button onClick={() => getInfo('applicant')} className={'ml-15'}*/}
                {/*                                type={'button'}>Получить*/}
                {/*                            данные</Button>*/}
                {/*                    </Flex>}*/}
                {/*                    {isEqual(applicant, 'organization') && <Flex justify={'flex-end'}>*/}
                {/*                        <Field onChange={(e) => setInn(e.target.value)} property={{*/}
                {/*                            hideLabel: true,*/}
                {/*                            mask: '999999999',*/}
                {/*                            placeholder: 'Inn',*/}
                {/*                            maskChar: '_'*/}
                {/*                        }} name={'inn'} type={'input-mask'}/>*/}

                {/*                        <Button onClick={() => getOrgInfo('applicant')} className={'ml-15'}*/}
                {/*                                type={'button'}>Получить*/}
                {/*                            данные</Button>*/}
                {/*                    </Flex>}*/}
                {/*                </Col>*/}
                {/*            </Row>*/}
                {/*        </Col>*/}
                {/*        <Col xs={12}>*/}
                {/*            <hr className={'mt-15 mb-15'}/>*/}
                {/*        </Col>*/}
                {/*        {isEqual(applicant, 'person') && <>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field params={{required: true}} defaultValue={get(applicantPerson, 'lastNameLatin')}*/}
                {/*                       label={'Lastname'}*/}
                {/*                       type={'input'}*/}
                {/*                       name={'applicant.person.fullName.lastname'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field params={{required: true}} defaultValue={get(applicantPerson, 'firstNameLatin')}*/}
                {/*                       label={'Firstname'}*/}
                {/*                       type={'input'}*/}
                {/*                       name={'applicant.person.fullName.firstname'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field params={{required: true}} defaultValue={get(applicantPerson, 'middleNameLatin')}*/}
                {/*                       label={'Middlename'}*/}
                {/*                       type={'input'}*/}
                {/*                       name={'applicant.person.fullName.middlename'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field params={{required: true}} defaultValue={get(applicantPerson, 'startDate')}*/}
                {/*                       label={'Дата выдачи паспорта'}*/}
                {/*                       type={'datepicker'}*/}
                {/*                       name={'applicant.person.passportData.startDate'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field params={{required: true}} defaultValue={get(applicantPerson, 'issuedBy')}*/}
                {/*                       label={'Кем выдан'}*/}
                {/*                       type={'input'}*/}
                {/*                       name={'applicant.person.passportData.issuedBy'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field*/}
                {/*                    params={{required: true}}*/}
                {/*                    defaultValue={get(applicantPerson, 'gender')}*/}
                {/*                    options={genderList}*/}
                {/*                    label={'Gender'}*/}
                {/*                    type={'select'}*/}
                {/*                    name={'insurant.person.gender'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field defaultValue={get(applicantPerson, 'pinfl')}*/}
                {/*                       label={'ПИНФЛ'} type={'input'}*/}
                {/*                       name={'applicant.person.passportData.pinfl'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field*/}
                {/*                    params={{*/}
                {/*                        required: true,*/}
                {/*                        pattern: {*/}
                {/*                            value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,*/}
                {/*                            message: 'Invalid format'*/}
                {/*                        }*/}
                {/*                    }}*/}
                {/*                    defaultValue={get(applicantPerson, 'phone')}*/}
                {/*                    label={'Phone'}*/}
                {/*                    type={'input'}*/}
                {/*                    property={{placeholder: '998XXXXXXXXX'}}*/}
                {/*                    name={'applicant.person.phone'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field*/}
                {/*                    defaultValue={get(applicantPerson, 'email')}*/}
                {/*                    label={'Email'}*/}
                {/*                    type={'input'}*/}
                {/*                    name={'applicant.person.email'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field*/}
                {/*                    params={{required: true}}*/}
                {/*                    options={residentTypeList}*/}
                {/*                    defaultValue={get(applicantPerson, 'residentType')}*/}
                {/*                    label={'Resident type'}*/}
                {/*                    type={'select'}*/}
                {/*                    name={'applicant.person.residentType'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field*/}
                {/*                    label={'Серия вод. удостоверения'}*/}
                {/*                    type={'input'}*/}
                {/*                    name={'applicant.person.driverLicenseSeria'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field*/}
                {/*                    label={'Номер вод. удостоверения'}*/}
                {/*                    type={'input'}*/}
                {/*                    name={'applicant.person.driverLicenseNumber'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field*/}
                {/*                    defaultValue={get(applicantPerson, 'birthCountry')}*/}
                {/*                    label={'Country'}*/}
                {/*                    type={'select'}*/}
                {/*                    options={countryList}*/}
                {/*                    name={'applicant.person.countryId'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field*/}
                {/*                    params={{required: true}}*/}
                {/*                    options={regionList}*/}
                {/*                    defaultValue={get(applicantPerson, 'regionId')}*/}
                {/*                    label={'Region'}*/}
                {/*                    type={'select'}*/}
                {/*                    name={'applicant.person.regionId'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field*/}
                {/*                    params={{required: true}}*/}
                {/*                    options={districtList}*/}
                {/*                    defaultValue={get(applicantPerson, 'districtId')}*/}
                {/*                    label={'District'}*/}
                {/*                    type={'select'}*/}
                {/*                    name={'applicant.person.districtId'}/>*/}
                {/*            </Col>*/}

                {/*            <Col xs={3}>*/}
                {/*                <Field*/}
                {/*                    params={{required: true}}*/}
                {/*                    options={areaTypesList}*/}
                {/*                    defaultValue={get(applicantPerson, 'areaTypeId')}*/}
                {/*                    label={'Тип местности'}*/}
                {/*                    type={'select'}*/}
                {/*                    name={'areaTypeId'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={6} className={'mb-25'}>*/}
                {/*                <Field*/}
                {/*                    noMaxWidth*/}
                {/*                    params={{required: true}}*/}
                {/*                    defaultValue={get(applicantPerson, 'address')}*/}
                {/*                    label={'Address'}*/}
                {/*                    type={'input'}*/}
                {/*                    name={'applicant.person.address'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={1} className={'mt-15'}>*/}
                {/*                <Field*/}
                {/*                    property={{disabled: true, type: 'hidden', hideLabel: true}}*/}
                {/*                    defaultValue={passportSeries}*/}
                {/*                    type={'input'}*/}
                {/*                    name={'applicant.person.passportData.seria'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={1} className={'mt-15'}>*/}
                {/*                <Field*/}
                {/*                    property={{disabled: true, type: 'hidden', hideLabel: true}}*/}
                {/*                    defaultValue={passportNumber}*/}
                {/*                    type={'input'}*/}
                {/*                    name={'applicant.person.passportData.number'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={1} className={'mt-15'}>*/}
                {/*                <Field*/}
                {/*                    property={{disabled: true, type: 'hidden', hideLabel: true}}*/}
                {/*                    defaultValue={dayjs(birthDate).format("YYYY-MM-DD")}*/}
                {/*                    type={'input'}*/}
                {/*                    name={'applicant.person.birthDate'}/>*/}
                {/*            </Col>*/}
                {/*        </>}*/}
                {/*        {isEqual(applicant, 'organization') && <>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field params={{required: true}} defaultValue={get(applicantOrganization, 'name')}*/}
                {/*                       label={'Наименование'} type={'input'}*/}
                {/*                       name={'applicant.organization.name'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field label={'Руководитель'} type={'input'}*/}
                {/*                       name={'applicant.organization.representativeName'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field label={'Должность'} type={'input'}*/}
                {/*                       name={'applicant.organization.position'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field defaultValue={get(applicantOrganization, 'email')} label={'Email'} type={'input'}*/}
                {/*                       name={'applicant.organization.email'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field defaultValue={get(applicantOrganization, 'phone')} params={{*/}
                {/*                    required: true,*/}
                {/*                    pattern: {*/}
                {/*                        value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,*/}
                {/*                        message: 'Invalid format'*/}
                {/*                    }*/}
                {/*                }}*/}
                {/*                       property={{placeholder: '998XXXXXXXXX'}}*/}
                {/*                       label={'Телефон'} type={'input'}*/}
                {/*                       name={'applicant.organization.phone'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3}><Field defaultValue={parseInt(get(applicantOrganization, 'oked'))}*/}
                {/*                               label={'Oked'} params={{required: true, valueAsString: true}}*/}
                {/*                               options={okedList}*/}
                {/*                               type={'select'}*/}
                {/*                               name={'applicant.organization.oked'}/></Col>*/}

                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field label={'Расчетный счет'} type={'input'}*/}
                {/*                       name={'applicant.organization.checkingAccount'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3}><Field label={'Форма собственности'}*/}
                {/*                               options={ownershipFormList}*/}
                {/*                               type={'select'}*/}
                {/*                               name={'insurant.organization.ownershipFormId'}/></Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field*/}
                {/*                    params={{required: true}}*/}
                {/*                    defaultValue={get(applicantOrganization, 'birthCountry', 210)}*/}
                {/*                    label={'Country'}*/}
                {/*                    type={'select'}*/}
                {/*                    options={countryList}*/}
                {/*                    name={'applicant.organization.countryId'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3}><Field label={'Область'} params={{required: true}} options={regionList}*/}
                {/*                               type={'select'}*/}
                {/*                               name={'applicant.organization.regionId'}/></Col>*/}
                {/*            <Col xs={3} className={'mb-25'}>*/}
                {/*                <Field*/}
                {/*                    params={{required: true}}*/}
                {/*                    options={districtList}*/}
                {/*                    defaultValue={get(applicantOrganization, 'districtId')}*/}
                {/*                    label={'District'}*/}
                {/*                    type={'select'}*/}
                {/*                    name={'applicant.organization.districtId'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={3}>*/}
                {/*                <Field*/}
                {/*                    params={{required: true}}*/}
                {/*                    options={areaTypesList}*/}
                {/*                    defaultValue={get(applicantOrganization, 'areaTypeId')}*/}
                {/*                    label={'Тип местности'}*/}
                {/*                    type={'select'}*/}
                {/*                    name={'areaTypeId'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={6} className={'mb-25'}>*/}
                {/*                <Field*/}
                {/*                    noMaxWidth*/}
                {/*                    params={{required: true}}*/}
                {/*                    defaultValue={get(applicantOrganization, 'address')}*/}
                {/*                    label={'Address'}*/}
                {/*                    type={'input'}*/}
                {/*                    name={'applicant.organization.address'}/>*/}
                {/*            </Col>*/}
                {/*            <Col xs={1} className={'mt-15'}>*/}
                {/*                <Field*/}
                {/*                    property={{disabled: true, type: 'hidden', hideLabel: true}}*/}
                {/*                    defaultValue={inn}*/}
                {/*                    type={'input'}*/}
                {/*                    name={'applicant.organization.inn'}/>*/}
                {/*            </Col>*/}


                {/*        </>}*/}


                {/*    </Row>*/}
                {/*</Form>*/}
            </Modal>

            <Modal title={'Добавление Пострадавшее имущество'} hide={() => setVisibleOtherPropertyDamage(false)}
                   visible={visibleOtherPropertyDamage}>
                {isLoadingVehicleInfo && <OverlayLoader/>}
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
                                            <Field onChange={(e) => setPropertyDamage(prev => ({inn: e.target.value}))}
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
                                    options={districtList}
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
                                    options={districtList}
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