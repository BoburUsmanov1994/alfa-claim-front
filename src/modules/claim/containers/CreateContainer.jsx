import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {find, get, every, isEqual, isNil, round, upperCase, values, isEmpty, sumBy, includes} from "lodash";
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
import Checkbox from 'rc-checkbox';
import Modal from "../../../components/modal";
import Table from "../../../components/table";
import {Trash2} from "react-feather";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import NumberFormat from "react-number-format";
import CarNumber from "../../../components/car-number"
const CreateContainer = () => {
    const [applicant, setApplicant] = useState('person')
    const [applicantPerson, setApplicantPerson] = useState(null)
    const [applicantOrganization, setApplicantOrganization] = useState(null)
    const [responsible, setResponsible] = useState('person')
    const [responsiblePerson, setResponsiblePerson] = useState(null)
    const [responsibleOrganization, setResponsibleOrganization] = useState(null)
    const [vehicle, setVehicle] = useState(null)
    const [passportSeries, setPassportSeries] = useState(null)
    const [passportNumber, setPassportNumber] = useState(null)
    const [birthDate, setBirthDate] = useState(null)
    const [insurantPassportSeries, setInsurantPassportSeries] = useState(null)
    const [insurantPassportNumber, setInsurantPassportNumber] = useState(null)
    const [insurantBirthDate, setInsurantBirthDate] = useState(null)
    const [inn, setInn] = useState(null)
    const [insurantInn, setInsurantInn] = useState(null)
    const [govNumber, setGovNumber] = useState(null)
    const [techPassportSeria, setTechPassportSeria] = useState(null)
    const [techPassportNumber, setTechPassportNumber] = useState(null)
    const [insurantIsOwner, setInsuranttIsOwner] = useState(false)
    const [visible, setVisible] = useState(false)
    const [regionId, setRegionId] = useState(null)
    const [idList, setIdList] = useState([])
    const [policies, setPolicies] = useState([])
    const [otherParams, setOtherParams] = useState({})
    const [visibleLifeDamage,setVisibleLifeDamage] = useState(false);

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
        enabled: !!(regionId || get(applicantPerson, 'regionId'))
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

    const getInfo = (type = 'owner') => {
        getPersonalInfoRequest({
                url: URLS.personalInfoProvider, attributes: type == 'insurant' ? {
                    birthDate: dayjs(insurantBirthDate).format('YYYY-MM-DD'),
                    passportSeries: insurantPassportSeries,
                    passportNumber: insurantPassportNumber
                } : {
                    birthDate: dayjs(birthDate).format('YYYY-MM-DD'), passportSeries, passportNumber
                }
            },
            {
                onSuccess: ({data}) => {
                    if (type == 'applicant') {
                        setApplicantPerson(get(data, 'result'));
                    }
                    if (type == 'responsible') {
                        setResponsiblePerson(get(data, 'result'));
                    }
                }
            }
        )
    }

    const getOrgInfo = (type = 'applicant') => {
        getOrganizationInfoRequest({
                url: URLS.organizationInfoProvider, attributes: type == 'responsible' ? {
                    inn: insurantInn
                } : {
                    inn: inn
                }
            },
            {
                onSuccess: ({data}) => {
                    if (type == 'applicant') {
                        setApplicantOrganization(get(data, 'result'))
                    }
                    if (type == 'responsible') {
                        setResponsibleOrganization(get(data, 'result'))
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
        if (isEqual(name, 'eventCircumstances.regionId')) {
            setRegionId(value)
        }
        if (isEqual(name, 'owner.organization.regionId')) {
            setRegionId(value)
        }
        if (isEqual(name, 'owner.person.regionId')) {
            setRegionId(value)
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
                    insurantIsOwner,
                    applicant: isEqual(insurantIsOwner ? applicant : responsible, 'person') ? {person: get(ownerType, 'person', {})} : {
                        organization: {
                            ...get(ownerType, 'organization', {})
                        }
                    },
                    insurant: isEqual(applicant, 'person') ? {person: get(insurantType, 'person', {})} : {
                        organization: {
                            ...get(insurantType, 'organization', {})
                        }
                    },
                    policies: policies.filter((_policy, index) => includes(idList, index)),
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
                                            <Button onClick={() => setApplicant('person')}
                                                    gray={!isEqual(applicant, 'person')} className={'mr-16'}
                                                    type={'button'}>Физ. лицо</Button>
                                            <Button onClick={() => setApplicant('organization')}
                                                    gray={!isEqual(applicant, 'organization')} type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {isEqual(applicant, 'person') && <Flex justify={'flex-end'}>
                                            <Field
                                                className={'mr-16'} style={{width: 75}}
                                                property={{
                                                    hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                    onChange: (val) => setPassportSeries(upperCase(val))
                                                }}
                                                name={'passportSeries'}
                                                type={'input-mask'}
                                            />
                                            <Field property={{
                                                hideLabel: true,
                                                mask: '9999999',
                                                placeholder: '1234567',
                                                maskChar: '_',
                                                onChange: (val) => setPassportNumber(val)
                                            }} name={'passportNumber'} type={'input-mask'}/>

                                            <Field className={'ml-15'}
                                                   property={{
                                                       hideLabel: true,
                                                       placeholder: 'Дата рождения',
                                                       onChange: (e) => setBirthDate(e)
                                                   }}
                                                   name={'birthDate'} type={'datepicker'}/>
                                            <Button onClick={() => getInfo('applicant')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                        {isEqual(applicant, 'organization') && <Flex justify={'flex-end'}>
                                            <Field onChange={(e) => setInn(e.target.value)} property={{
                                                hideLabel: true,
                                                mask: '999999999',
                                                placeholder: 'Inn',
                                                maskChar: '_'
                                            }} name={'inn'} type={'input-mask'}/>

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
                            {isEqual(applicant, 'person') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicantPerson, 'lastNameLatin')}
                                           label={'Lastname'}
                                           type={'input'}
                                           name={'applicant.person.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicantPerson, 'firstNameLatin')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'applicant.person.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicantPerson, 'middleNameLatin')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'applicant.person.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicantPerson, 'startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'applicant.person.passportData.startDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicantPerson, 'issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'applicant.person.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(applicantPerson, 'gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'insurant.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(applicantPerson, 'pinfl')}
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
                                        defaultValue={get(applicantPerson, 'phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        property={{placeholder: '998XXXXXXXXX'}}
                                        name={'applicant.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(applicantPerson, 'email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'applicant.person.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={residentTypeList}
                                        defaultValue={get(applicantPerson, 'residentType')}
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
                                        defaultValue={get(applicantPerson, 'birthCountry')}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'applicant.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={regionList}
                                        defaultValue={get(applicantPerson, 'regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'applicant.person.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(applicantPerson, 'districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'applicant.person.districtId'}/>
                                </Col>

                                <Col xs={3}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={get(applicantPerson, 'areaTypeId')}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(applicantPerson, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'applicant.person.address'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={passportSeries}
                                        type={'input'}
                                        name={'applicant.person.passportData.seria'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={passportNumber}
                                        type={'input'}
                                        name={'applicant.person.passportData.number'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={dayjs(birthDate).format("YYYY-MM-DD")}
                                        type={'input'}
                                        name={'applicant.person.birthDate'}/>
                                </Col>
                            </>}
                            {isEqual(applicant, 'organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicantOrganization, 'name')}
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
                                    <Field defaultValue={get(applicantOrganization, 'email')} label={'Email'} type={'input'}
                                           name={'applicant.organization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(applicantOrganization, 'phone')} params={{
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
                                <Col xs={3}><Field defaultValue={parseInt(get(applicantOrganization, 'oked'))}
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
                                        defaultValue={get(applicantOrganization, 'birthCountry', 210)}
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
                                        defaultValue={get(applicantOrganization, 'districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'applicant.organization.districtId'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={get(applicantOrganization, 'areaTypeId')}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(applicantOrganization, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'applicant.organization.address'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={inn}
                                        type={'input'}
                                        name={'applicant.organization.inn'}/>
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
                                            <Button onClick={() => setResponsible('person')}
                                                    gray={!isEqual(responsible, 'person')} className={'mr-16'}
                                                    type={'button'}>Физ. лицо</Button>
                                            <Button onClick={() => setResponsible('organization')}
                                                    gray={!isEqual(responsible, 'organization')} type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {isEqual(responsible, 'person') && <Flex justify={'flex-end'}>
                                            <Field
                                                className={'mr-16'} style={{width: 75}}
                                                property={{
                                                    hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                    onChange: (val) => setPassportSeries(upperCase(val))
                                                }}
                                                name={'passportSeries'}
                                                type={'input-mask'}
                                            />
                                            <Field property={{
                                                hideLabel: true,
                                                mask: '9999999',
                                                placeholder: '1234567',
                                                maskChar: '_',
                                                onChange: (val) => setPassportNumber(val)
                                            }} name={'passportNumber'} type={'input-mask'}/>

                                            <Field className={'ml-15'}
                                                   property={{
                                                       hideLabel: true,
                                                       placeholder: 'Дата рождения',
                                                       onChange: (e) => setBirthDate(e)
                                                   }}
                                                   name={'birthDate'} type={'datepicker'}/>
                                            <Button onClick={() => getInfo('responsible')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                        {isEqual(responsible, 'organization') && <Flex justify={'flex-end'}>
                                            <Field onChange={(e) => setInn(e.target.value)} property={{
                                                hideLabel: true,
                                                mask: '999999999',
                                                placeholder: 'Inn',
                                                maskChar: '_'
                                            }} name={'inn'} type={'input-mask'}/>

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
                            {isEqual(applicant, 'person') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsiblePerson, 'lastNameLatin')}
                                           label={'Lastname'}
                                           type={'input'}
                                           name={'responsibleForDamage.person.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsiblePerson, 'firstNameLatin')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'responsibleForDamage.person.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsiblePerson, 'middleNameLatin')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'responsibleForDamage.person.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsiblePerson, 'startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'responsibleForDamage.person.passportData.startDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsiblePerson, 'issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'responsibleForDamage.person.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(responsiblePerson, 'gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'responsibleForDamage.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(responsiblePerson, 'pinfl')}
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
                                        defaultValue={get(responsiblePerson, 'phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        property={{placeholder: '998XXXXXXXXX'}}
                                        name={'responsibleForDamage.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(responsiblePerson, 'email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'responsibleForDamage.person.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={residentTypeList}
                                        defaultValue={get(responsiblePerson, 'residentType')}
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
                                        defaultValue={get(responsiblePerson, 'birthCountry')}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'responsibleForDamage.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={regionList}
                                        defaultValue={get(responsiblePerson, 'regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'responsibleForDamage.person.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(responsiblePerson, 'districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleForDamage.person.districtId'}/>
                                </Col>

                                <Col xs={3}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={get(responsiblePerson, 'areaTypeId')}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(responsiblePerson, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'responsibleForDamage.person.address'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={passportSeries}
                                        type={'input'}
                                        name={'responsibleForDamage.person.passportData.seria'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={passportNumber}
                                        type={'input'}
                                        name={'responsibleForDamage.person.passportData.number'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={dayjs(birthDate).format("YYYY-MM-DD")}
                                        type={'input'}
                                        name={'responsibleForDamage.person.birthDate'}/>
                                </Col>
                            </>}
                            {isEqual(responsible, 'organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsibleOrganization, 'name')}
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
                                    <Field defaultValue={get(responsibleOrganization, 'email')} label={'Email'} type={'input'}
                                           name={'responsibleForDamage.organization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(responsibleOrganization, 'phone')} params={{
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
                                <Col xs={3}><Field defaultValue={parseInt(get(responsibleOrganization, 'oked'))}
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
                                        defaultValue={get(responsibleOrganization, 'birthCountry', 210)}
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
                                        defaultValue={get(responsibleOrganization, 'districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleForDamage.organization.districtId'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={get(responsibleOrganization, 'areaTypeId')}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(responsibleOrganization, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'responsibleForDamage.organization.address'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={inn}
                                        type={'input'}
                                        name={'responsibleForDamage.organization.inn'}/>
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
                                            <Button onClick={() => setResponsible('person')}
                                                    gray={!isEqual(responsible, 'person')} className={'mr-16'}
                                                    type={'button'}>Физ. лицо</Button>
                                            <Button onClick={() => setResponsible('organization')}
                                                    gray={!isEqual(responsible, 'organization')} type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        {isEqual(responsible, 'person') && <Flex justify={'flex-end'}>
                                            <Field
                                                className={'mr-16'} style={{width: 75}}
                                                property={{
                                                    hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                    onChange: (val) => setPassportSeries(upperCase(val))
                                                }}
                                                name={'passportSeries'}
                                                type={'input-mask'}
                                            />
                                            <Field property={{
                                                hideLabel: true,
                                                mask: '9999999',
                                                placeholder: '1234567',
                                                maskChar: '_',
                                                onChange: (val) => setPassportNumber(val)
                                            }} name={'passportNumber'} type={'input-mask'}/>

                                            <Field className={'ml-15'}
                                                   property={{
                                                       hideLabel: true,
                                                       placeholder: 'Дата рождения',
                                                       onChange: (e) => setBirthDate(e)
                                                   }}
                                                   name={'birthDate'} type={'datepicker'}/>
                                            <Button onClick={() => getInfo('responsible')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex>}
                                        {isEqual(responsible, 'organization') && <Flex justify={'flex-end'}>
                                            <Field onChange={(e) => setInn(e.target.value)} property={{
                                                hideLabel: true,
                                                mask: '999999999',
                                                placeholder: 'Inn',
                                                maskChar: '_'
                                            }} name={'inn'} type={'input-mask'}/>

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
                            {isEqual(applicant, 'person') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsiblePerson, 'lastNameLatin')}
                                           label={'Lastname'}
                                           type={'input'}
                                           name={'responsibleForDamage.person.fullName.lastname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsiblePerson, 'firstNameLatin')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'responsibleForDamage.person.fullName.firstname'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsiblePerson, 'middleNameLatin')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'responsibleForDamage.person.fullName.middlename'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsiblePerson, 'startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'responsibleForDamage.person.passportData.startDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsiblePerson, 'issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'responsibleForDamage.person.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(responsiblePerson, 'gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'responsibleForDamage.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(responsiblePerson, 'pinfl')}
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
                                        defaultValue={get(responsiblePerson, 'phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        property={{placeholder: '998XXXXXXXXX'}}
                                        name={'responsibleForDamage.person.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(responsiblePerson, 'email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'responsibleForDamage.person.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={residentTypeList}
                                        defaultValue={get(responsiblePerson, 'residentType')}
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
                                        defaultValue={get(responsiblePerson, 'birthCountry')}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'responsibleForDamage.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={regionList}
                                        defaultValue={get(responsiblePerson, 'regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'responsibleForDamage.person.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(responsiblePerson, 'districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleForDamage.person.districtId'}/>
                                </Col>

                                <Col xs={3}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={get(responsiblePerson, 'areaTypeId')}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(responsiblePerson, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'responsibleForDamage.person.address'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={passportSeries}
                                        type={'input'}
                                        name={'responsibleForDamage.person.passportData.seria'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={passportNumber}
                                        type={'input'}
                                        name={'responsibleForDamage.person.passportData.number'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={dayjs(birthDate).format("YYYY-MM-DD")}
                                        type={'input'}
                                        name={'responsibleForDamage.person.birthDate'}/>
                                </Col>
                            </>}
                            {isEqual(responsible, 'organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(responsibleOrganization, 'name')}
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
                                    <Field defaultValue={get(responsibleOrganization, 'email')} label={'Email'} type={'input'}
                                           name={'responsibleForDamage.organization.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(responsibleOrganization, 'phone')} params={{
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
                                <Col xs={3}><Field defaultValue={parseInt(get(responsibleOrganization, 'oked'))}
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
                                        defaultValue={get(responsibleOrganization, 'birthCountry', 210)}
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
                                        defaultValue={get(responsibleOrganization, 'districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleForDamage.organization.districtId'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={get(responsibleOrganization, 'areaTypeId')}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(responsibleOrganization, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'responsibleForDamage.organization.address'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={inn}
                                        type={'input'}
                                        name={'responsibleForDamage.organization.inn'}/>
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
                                           thead={['№ ', 'ПИНФЛ', 'Фамилия', 'Имя', 'Отчество',  'Action']}>
                                        {
                                            policies.map((item, index) => <tr>
                                    
                                                <td>{index + 1}</td>
                                                <td>{get(find(vehicleTypeList, (_vehicle) => get(_vehicle, 'value') == get(item, 'objects[0].vehicle.vehicleTypeId')), 'label', '-')}</td>
                                                <td>{get(item, 'objects[0].vehicle.modelCustomName')}</td>
                                                <td>{get(item, 'objects[0].vehicle.govNumber')}</td>
                                                <td><NumberFormat value={get(item, 'insurancePremium', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>
                                                <td><NumberFormat value={get(item, 'insuranceSum', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>

                                                <td><Trash2
                                                    onClick={() => setPolicies(policies.filter((d, i) => i != index))}
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
                                           thead={[ '№ ', 'ПИНФЛ', 'Фамилия', 'Имя', 'Отчество',  'Action']}>
                                        {
                                            policies.map((item, index) => <tr>
                                        
                                                <td>{index + 1}</td>
                                                <td>{get(find(vehicleTypeList, (_vehicle) => get(_vehicle, 'value') == get(item, 'objects[0].vehicle.vehicleTypeId')), 'label', '-')}</td>
                                                <td>{get(item, 'objects[0].vehicle.modelCustomName')}</td>
                                                <td>{get(item, 'objects[0].vehicle.govNumber')}</td>
                                                <td><NumberFormat value={get(item, 'insurancePremium', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>
                                                <td><NumberFormat value={get(item, 'insuranceSum', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>

                                                <td><Trash2
                                                    onClick={() => setPolicies(policies.filter((d, i) => i != index))}
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
                                           thead={[ '№ ', 'Гос.номер', 'Модель', 'Серия тех.паспорта', 'Номер тех.паспорта', 'Action']}>
                                        {
                                            policies.map((item, index) => <tr>
                                                <td><Checkbox checked={includes(idList, index)} onChange={(e) => {
                                                    if (e.target?.checked) {
                                                        setIdList(prev => ([...prev, index]))
                                                    } else {
                                                        setIdList(idList.filter(id => !isEqual(id, index)))
                                                    }
                                                }}/></td>
                                                <td>{index + 1}</td>
                                                <td>{get(find(vehicleTypeList, (_vehicle) => get(_vehicle, 'value') == get(item, 'objects[0].vehicle.vehicleTypeId')), 'label', '-')}</td>
                                                <td>{get(item, 'objects[0].vehicle.modelCustomName')}</td>
                                                <td>{get(item, 'objects[0].vehicle.govNumber')}</td>
                                                <td><NumberFormat value={get(item, 'insurancePremium', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>
                                                <td><NumberFormat value={get(item, 'insuranceSum', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>

                                                <td><Trash2
                                                    onClick={() => setPolicies(policies.filter((d, i) => i != index))}
                                                    className={'cursor-pointer'} color={'red'}/></td>
                                            </tr>)
                                        }
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                        <Row gutterWidth={60} className={'mt-30'}>
                            <Col xs={12} className={'mb-15'}><Title>Вред иному имуществу(Пострадавшее имущество)</Title></Col>
                            <Col xs={12}>
                                <Flex justify={'flex-end'}>
                                    <Button
                                       className={'ml-15'}
                                        type={'button'}>Добавить</Button></Flex>
                            </Col>
                            <Col xs={12}>
                                <div className={'horizontal-scroll mt-15 mb-25'}>
                                    <Table bordered hideThead={false}
                                           thead={[ '№ ', 'Описание имущества', 'Размер вреда',  'Action']}>
                                        {
                                            policies.map((item, index) => <tr>
                                                <td><Checkbox checked={includes(idList, index)} onChange={(e) => {
                                                    if (e.target?.checked) {
                                                        setIdList(prev => ([...prev, index]))
                                                    } else {
                                                        setIdList(idList.filter(id => !isEqual(id, index)))
                                                    }
                                                }}/></td>
                                                <td>{index + 1}</td>
                                                <td>{get(find(vehicleTypeList, (_vehicle) => get(_vehicle, 'value') == get(item, 'objects[0].vehicle.vehicleTypeId')), 'label', '-')}</td>
                                                <td>{get(item, 'objects[0].vehicle.modelCustomName')}</td>
                                                <td>{get(item, 'objects[0].vehicle.govNumber')}</td>
                                                <td><NumberFormat value={get(item, 'insurancePremium', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>
                                                <td><NumberFormat value={get(item, 'insuranceSum', 0)}
                                                                  displayType={'text'} thousandSeparator={' '}/></td>

                                                <td><Trash2
                                                    onClick={() => setPolicies(policies.filter((d, i) => i != index))}
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
                            setPolicies(prev => ([...prev, get(item, 'vehicle')]));
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
            <Modal  title={'Добавление Потерпевшие'} hide={() => setVisibleLifeDamage(false)} visible={visibleLifeDamage}>
                {isLoadingVehicleInfo && <OverlayLoader/>}
                <Form
                    formRequest={({data: item}) => {
                      
                    }}
                    getValueFromField={(value, name) => getFieldData(name, value)}
                    footer={<Flex className={'mt-16'}><Button>Добавить</Button></Flex>}>
                    <Row align={'end'}>
                        <Col xs={12} className={' mt-15'}>
                        <Flex justify={''}>
                                            <Field
                                                className={'mr-16'} style={{width: 75}}
                                                property={{
                                                    hideLabel: true, mask: 'aa', placeholder: 'AA', maskChar: '_',
                                                    onChange: (val) => setPassportSeries(upperCase(val))
                                                }}
                                                name={'passportSeries'}
                                                type={'input-mask'}
                                            />
                                            <Field property={{
                                                hideLabel: true,
                                                mask: '9999999',
                                                placeholder: '1234567',
                                                maskChar: '_',
                                                onChange: (val) => setPassportNumber(val)
                                            }} name={'passportNumber'} type={'input-mask'}/>

                                            <Field className={'ml-15'}
                                                   property={{
                                                       hideLabel: true,
                                                       placeholder: 'Дата рождения',
                                                       onChange: (e) => setBirthDate(e)
                                                   }}
                                                   name={'birthDate'} type={'datepicker'}/>
                                            <Button onClick={() => getInfo('applicant')} className={'ml-15'}
                                                    type={'button'}>Получить
                                                данные</Button>
                                        </Flex></Col>
                    
                        <Col xs={12}>
                            <hr className={'mt-15'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicantPerson, 'lastNameLatin')}
                                           label={'Lastname'}
                                           type={'input'}
                                           name={'applicant.person.fullName.lastname'}/>
                                </Col>
                                <Col xs={4} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicantPerson, 'firstNameLatin')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'applicant.person.fullName.firstname'}/>
                                </Col>
                                <Col xs={4} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicantPerson, 'middleNameLatin')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'applicant.person.fullName.middlename'}/>
                                </Col>
                                <Col xs={4} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicantPerson, 'startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'applicant.person.passportData.startDate'}/>
                                </Col>
                                <Col xs={4} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(applicantPerson, 'issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'applicant.person.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={4} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={get(applicantPerson, 'gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'insurant.person.gender'}/>
                                </Col>
                                <Col xs={4} className={'mb-25'}>
                                    <Field defaultValue={get(applicantPerson, 'pinfl')}
                                           label={'ПИНФЛ'} type={'input'}
                                           name={'applicant.person.passportData.pinfl'}/>
                                </Col>
                                <Col xs={4} className={'mb-25'}>
                                    <Field
                                        params={{
                                            required: true,
                                            pattern: {
                                                value: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/,
                                                message: 'Invalid format'
                                            }
                                        }}
                                        defaultValue={get(applicantPerson, 'phone')}
                                        label={'Phone'}
                                        type={'input'}
                                        property={{placeholder: '998XXXXXXXXX'}}
                                        name={'applicant.person.phone'}/>
                                </Col>
                                <Col xs={4} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(applicantPerson, 'email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'applicant.person.email'}/>
                                </Col>
                                <Col xs={4} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={residentTypeList}
                                        defaultValue={get(applicantPerson, 'residentType')}
                                        label={'Resident type'}
                                        type={'select'}
                                        name={'applicant.person.residentType'}/>
                                </Col>
                                <Col xs={4} className={'mb-25'}>
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
                                <Col xs={4} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(applicantPerson, 'birthCountry')}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'applicant.person.countryId'}/>
                                </Col>
                                <Col xs={4} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={regionList}
                                        defaultValue={get(applicantPerson, 'regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'applicant.person.regionId'}/>
                                </Col>
                                <Col xs={4} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(applicantPerson, 'districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'applicant.person.districtId'}/>
                                </Col>

                                <Col xs={4}>
                                    <Field
                                        params={{required: true}}
                                        options={areaTypesList}
                                        defaultValue={get(applicantPerson, 'areaTypeId')}
                                        label={'Тип местности'}
                                        type={'select'}
                                        name={'areaTypeId'}/>
                                </Col>
                                <Col xs={12} className={'mt-15'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(applicantPerson, 'address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'applicant.person.address'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={passportSeries}
                                        type={'input'}
                                        name={'applicant.person.passportData.seria'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={passportNumber}
                                        type={'input'}
                                        name={'applicant.person.passportData.number'}/>
                                </Col>
                                <Col xs={1} className={'mt-15'}>
                                    <Field
                                        property={{disabled: true, type: 'hidden', hideLabel: true}}
                                        defaultValue={dayjs(birthDate).format("YYYY-MM-DD")}
                                        type={'input'}
                                        name={'applicant.person.birthDate'}/>
                                </Col>
                    
                    </Row>
                </Form>
            </Modal>
        </Section>
    </>);
};

export default CreateContainer;