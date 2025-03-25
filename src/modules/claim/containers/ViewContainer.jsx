import React, {useEffect, useMemo, useState} from 'react';
import {get, includes, isEqual, range} from "lodash";
import Panel from "../../../components/panel";
import Search from "../../../components/search";
import {Col, Row} from "react-grid-system";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import Button from "../../../components/ui/button";
import Form from "../../../containers/form/form";
import Flex from "../../../components/flex";
import Field from "../../../containers/form/field";
import {useDeleteQuery, useGetAllQuery, usePostQuery, usePutQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {getSelectOptionsListFromData} from "../../../utils";
import {OverlayLoader} from "../../../components/loader";
import {useNavigate} from "react-router-dom";
import {useStore} from "../../../store";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import Checkbox from "rc-checkbox";
import Table from "../../../components/table";
import Modal from "../../../components/modal";
import {Minus, Plus} from "react-feather";

const ViewContainer = ({claimFormId = null}) => {
    const {t} = useTranslation()
    const navigate = useNavigate();
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const [open, setOpen] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openPaymentModal, setOpenPaymentModal] = useState(false)
    const [openPaymentEditModal, setOpenPaymentEditModal] = useState(false)
    const [lifePayoutsCount, setLifePayoutsCount] = useState(0)
    const [healthPayoutsCount, setHealthPayoutsCount] = useState(0)
    const [otherPropertyPayoutsCount, setOtherPropertyPayoutsCount] = useState(0)
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'Claims list', path: '/claim',
    }, {
        id: 2, title: 'Claim view', path: '/claim',
    }], [])


    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])
    const {data, isLoading,refetch} = useGetAllQuery({
        key: KEYS.view,
        url: URLS.view,
        params: {
            params: {
                claimFormId: claimFormId
            }
        },
        enabled: !!(claimFormId)
    })

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

    const {data: insuranceTypes} = useGetAllQuery({
        key: KEYS.insuranceTypes, url: URLS.insuranceTypes
    })
    const insuranceTypeList = getSelectOptionsListFromData(get(insuranceTypes, `data.result`, []), 'id', 'name')

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


    const {data: okeds} = useGetAllQuery({
        key: KEYS.okeds, url: URLS.okeds
    })
    const okedList = getSelectOptionsListFromData(get(okeds, `data.result`, []), 'id', 'name')


    const {data: decisions} = useGetAllQuery({
        key: KEYS.decisions, url: URLS.decisions
    })
    const decisionList = getSelectOptionsListFromData(get(decisions, `data.result`, []), 'id', 'name')

    const {data: decision} = useGetAllQuery({
        key: [KEYS.decision,claimFormId], url: URLS.decision,
        params:{
            params:{
                claimFormId
            }
        },
        hideErrorMsg:true
    })
    const {data: paymentData} = useGetAllQuery({
        key: [KEYS.payment,claimFormId], url: URLS.payment,
        params:{
            params:{
                claimFormId
            }
        },
        hideErrorMsg:true
    })

    const {data: district} = useGetAllQuery({
        key: [KEYS.districts],
        url: URLS.districts,
    })
    const districtList = getSelectOptionsListFromData(get(district, `data.result`, []), 'id', 'name')


    const {
        mutate: sendFond, isLoading: isLoadingFond
    } = usePostQuery({listKeyId: KEYS.view})
    const {
        mutate: confirmPayedRequest, isLoading: isLoadingConfirmPayed
    } = usePostQuery({listKeyId: KEYS.view})

    const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.remove})
    const {mutate: editDecisionRequest} = usePutQuery({listKeyId: [KEYS.decision,claimFormId]})
    const {
        mutate: sendDecisionRequest, isLoading: isLoadingSendDecision
    } = usePostQuery({listKeyId: KEYS.view})
    const {
        mutate: paymentRequest, isLoading: isLoadingPayment
    } = usePostQuery({listKeyId: KEYS.view})

    const {mutate: editPaymentRequest} = usePutQuery({listKeyId: [KEYS.payment,claimFormId]})
    const {
        mutate: sendPaymentRequest, isLoading: isLoadingSendPayment
    } = usePostQuery({listKeyId: KEYS.view})

    const acceptDecision = ({data}) => {
        confirmPayedRequest({
                url: URLS.decision, attributes: {
                    claimFormId: parseInt(claimFormId),
                    ...data
                }
            },
            {
                onSuccess: () => {
                    setOpen(false);
                }
            }
        )
    }

    const editDecision = ({data}) => {
        editDecisionRequest({url:URLS.editDecision,attributes:{claimFormId: parseInt(claimFormId), ...data}},{onSuccess:()=>{
            refetch()
                setOpenEditModal(false)
            }})
    }
    const sendDecision = () => {
        sendDecisionRequest({
            url:`${URLS.sendDecision}?claimFormId=${claimFormId}`
        },{
            onSuccess:()=>{
                refetch()
            }
        })
    }

    const cancelDecision = () => {
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
            confirmButtonText: t('Yes'),
            cancelButtonText: t('No'),
            customClass: {
                title: 'title-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRequest({url: `${URLS.cancelDecision}?claimFormId=${claimFormId}`}, {
                    onSuccess: () => {
                        refetch()
                    }
                })
            }
        });
    }

    const send = () => {
        sendFond({
                url: `${URLS.send}?claimFormId=${claimFormId}`, attributes: {}
            }
        )
    }

    const payment = ({data}) => {
        paymentRequest({
            url:URLS.payment,attributes:{
                ...data,
                claimFormId: parseInt(claimFormId),
            }
        },{
            onSuccess: () => {
                refetch()
                setOpenPaymentModal(false);
                setLifePayoutsCount(0);
                setHealthPayoutsCount(0);
                setOtherPropertyPayoutsCount(0);
            }
        })
    }

    const sendPayment = () => {
        sendPaymentRequest({
            url:`${URLS.sendPayment}?claimFormId=${claimFormId}`
        },{
            onSuccess:()=>{
                refetch()
            }
        })
    }

    const editPayment = ({data}) => {
        editPaymentRequest({
            url:URLS.editPayment,
            attributes:{
...data,
                claimFormId: parseInt(claimFormId),
            }
        },{
            onSuccess:()=>{
                refetch()
                setOpenPaymentEditModal(false);
                setLifePayoutsCount(0);
                setHealthPayoutsCount(0);
                setOtherPropertyPayoutsCount(0);
            }
        })
    }
    const cancelPayment = () => {
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
            confirmButtonText: t('Yes'),
            cancelButtonText: t('No'),
            customClass: {
                title: 'title-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRequest({url: `${URLS.cancelPayment}?claimFormId=${claimFormId}`}, {
                    onSuccess: () => {
                        refetch()
                    }
                })
            }
        });
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
                deleteRequest({url: `${URLS.remove}?claimFormId=${claimFormId}`}, {
                    onSuccess: () => {
                        navigate('/claim')
                    }
                })
            }
        });
    }
    useEffect(() => {
        if(openPaymentEditModal && get(paymentData,'data.result')){
            if(get(paymentData,'data.result.healthPayouts',[])?.length > 0){
                setHealthPayoutsCount(get(paymentData,'data.result.healthPayouts',[])?.length)
            }
            if(get(paymentData,'data.result.lifePayouts',[])?.length > 0){
                setLifePayoutsCount(get(paymentData,'data.result.lifePayouts',[])?.length)
            }
            if(get(paymentData,'data.result.otherPropertyPayouts',[])?.length > 0){
                setOtherPropertyPayoutsCount(get(paymentData,'data.result.otherPropertyPayouts',[])?.length)
            }
        }
    }, [paymentData,openPaymentEditModal]);

    if (isLoading || isLoadingRegion || isLoadingCountry) {
        return <OverlayLoader/>
    }
    console.log('paymentData',paymentData)
    return (<>
        {(isLoadingFond || deleteLoading || isLoadingConfirmPayed || isLoadingSendDecision) && <OverlayLoader/>}
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
            </>}
                {includes(['new','edited'],get(data, 'data.result.status')) && <Button
                    onClick={send}
                    type={'button'} className={'mr-16'}>Отправить в
                    Фонд</Button>}

                {  !get(data, 'data.result.decisionId') && includes(['sent','cancel_decision'], get(data, 'data.result.status')) && <><Button gray
                    onClick={() => setOpen(true) }
                    type={'button'} className={'mr-16'} yellow>Принять решение</Button>

               </>

                }



                {get(data, 'data.result.decisionId') && includes(['sent','add_decision'],get(data, 'data.result.status')) && <Button
                    onClick={cancelDecision}
                    danger
                    type={'button'} className={'mr-16'}>Отменить решение</Button>

                }
                {
                    get(data, 'data.result.decisionId') && includes(['add_decision','sent'], get(data, 'data.result.status')) && <Button
                        onClick={ () => setOpenEditModal(true) }
                        yellow
                        type={'button'} className={'mr-16'}>Редактировать решение</Button>
                }
                {
                    get(data, 'data.result.decisionId') && includes(['sent','add_decision'],get(data, 'data.result.status')) && <Button
                        onClick={sendDecision}
                        green
                        type={'button'} className={'mr-16'}>Отправка решение</Button>
                }
                {includes(['sent_decision'],get(data, 'data.result.status')) && <Button
                    onClick={()=>setOpenPaymentModal(true)}
                    green
                    type={'button'} className={'mr-16'}>Оплата</Button>}
                { includes(['add_payment'],get(data, 'data.result.status')) && <Button
                    onClick={cancelPayment}
                    danger
                    type={'button'} className={'mr-16'}>Отменить оплаты</Button>

                }
                {
                    includes(['add_payment'], get(data, 'data.result.status')) && <Button
                        onClick={ () => setOpenPaymentEditModal(true) }
                        yellow
                        type={'button'} className={'mr-16'}>Редактировать оплаты</Button>
                }
                {includes(['add_payment'],get(data, 'data.result.status')) && <Button
                    onClick={sendPayment}
                    green
                    type={'button'} className={'mr-16'}>Отправить оплаты</Button>}


            </Flex>}>
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
                            <Col xs={5}>Виды страхования:</Col>
                            <Col xs={7}><Field disabled defaultValue={get(data, 'data.result.insuranceType')} options={insuranceTypeList} params={{required: true}}
                                               label={'Виды страхования'} property={{hideLabel: true}}
                                               type={'select'}
                                               name={'insuranceType'}/></Col>
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
                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>UUID полиса: </Col>
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.polisUuid')}
                                                property={{hideLabel: true, disabled: true}}
                                               type={'input'}
                                               name={'polisUuid'}/></Col>
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
                            <Col xs={7}>{get(data, 'data.result.eventCircumstances.courtDecision.courtDecisionDate') && <Field
                                disabled
                                defaultValue={get(data, 'data.result.eventCircumstances.courtDecision.courtDecisionDate')}
                                params={{required: true}}
                                property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                name={'eventCircumstances.courtDecision.courtDecisionDate.test'}/>}</Col>
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
                                disabled
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
                                            name={'responsibleForDamage.person.passportData.seria'}
                                            type={'input-mask'}
                                            defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.seria')}
                                        />
                                        <Field disabled property={{
                                            hideLabel: true,
                                            mask: '9999999',
                                            placeholder: '1234567',
                                            maskChar: '_',
                                        }} name={'responsibleForDamage.person.passportData.number'}
                                               type={'input-mask'}
                                               defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.number')}
                                        />

                                        <Field className={'ml-15'}
                                               disabled
                                               property={{
                                                   hideLabel: true,
                                                   placeholder: 'Дата рождения',
                                               }}
                                               name={'responsibleForDamage.person.birthDate'} type={'datepicker'}
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
                                            }} name={'responsibleForDamage.organization.inn'} type={'input-mask'}/>

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
                                   name={'responsibleForDamage.person.fullName.lastname'}
                                   property={{disabled: true}}
                            />
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.person.fullName.firstname')}
                                   label={'Firstname'}
                                   type={'input'}
                                   name={'responsibleForDamage.person.fullName.firstname'}
                                   property={{disabled: true}}
                            />
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.person.fullName.middlename')}
                                   label={'Middlename'}
                                   type={'input'}
                                   name={'responsibleForDamage.person.fullName.middlename'}
                                   property={{disabled: true}}
                            />
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field disabled params={{required: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.startDate')}
                                   label={'Дата выдачи паспорта'}
                                   type={'datepicker'}
                                   name={'responsibleForDamage.person.passportData.startDate'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}} params={{required: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.issuedBy')}
                                   label={'Кем выдан'}
                                   type={'input'}
                                   name={'responsibleForDamage.person.passportData.issuedBy'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.gender')}
                                options={genderList}
                                label={'Gender'}
                                type={'select'}
                                name={'responsibleForDamage.person.gender'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.pinfl')}
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
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.phone')}
                                label={'Phone'}
                                type={'input'}
                                property={{placeholder: '998XXXXXXXXX', disabled: true}}
                                name={'responsibleForDamage.person.phone'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.email')}
                                label={'Email'}
                                type={'input'}
                                property={{disabled: true}}
                                name={'responsibleForDamage.person.email'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={residentTypeList}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.residentType')}
                                label={'Resident type'}
                                type={'select'}
                                name={'responsibleForDamage.person.residentType'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.driverLicenseSeria')}
                                label={'Серия вод. удостоверения'}
                                type={'input'}
                                name={'responsibleForDamage.person.driverLicenseSeria'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.driverLicenseNumber')}
                                label={'Номер вод. удостоверения'}
                                type={'input'}
                                name={'responsibleForDamage.person.driverLicenseNumber'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.countryId', 210)}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                name={'responsibleForDamage.person.countryId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={regionList}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.regionId')}
                                label={'Region'}
                                type={'select'}
                                name={'responsibleForDamage.person.regionId'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={districtList}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.districtId')}
                                label={'District'}
                                type={'select'}
                                name={'responsibleForDamage.person.districtId'}/>
                        </Col>

                        <Col xs={6} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                defaultValue={get(data, 'data.result.responsibleForDamage.person.address')}
                                label={'Address'}
                                type={'input'}
                                property={{disabled: true}}
                                name={'responsibleForDamage.person.address'}/>
                        </Col>
                    </>}
                    {get(data, 'data.result.responsibleForDamage.organization') && <>
                        <Col xs={3} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.organization.name')}
                                   label={'Наименование'} type={'input'}
                                   property={{disabled: true}}
                                   name={'responsibleForDamage.organization.name'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.result.responsibleForDamage.organization.representativeName')}
                                label={'Руководитель'} type={'input'}
                                property={{disabled: true}}
                                name={'responsibleForDamage.organization.representativeName'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field defaultValue={get(data, 'data.result.responsibleForDamage.organization.position')}
                                   label={'Должность'} type={'input'}
                                   property={{disabled: true}}
                                   name={'responsibleForDamage.organization.position'}/>
                        </Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                defaultValue={get(data, 'data.result.responsibleForDamage.organization.email')}
                                label={'Email'}
                                type={'input'}
                                name={'responsibleForDamage.organization.email'}
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
                                   name={'responsibleForDamage.organization.phone'}/>
                        </Col>
                        <Col xs={3}><Field disabled
                                           defaultValue={parseInt(get(data, 'data.result.responsibleForDamage.organization.oked'))}
                                           label={'Oked'} params={{required: true, valueAsString: true}}
                                           options={okedList}
                                           type={'select'}
                                           name={'responsibleForDamage.organization.oked'}/></Col>

                        <Col xs={3} className={'mb-25'}>
                            <Field property={{disabled: true}}
                                   defaultValue={get(data, 'data.result.responsibleForDamage.organization.checkingAccount')}
                                   label={'Расчетный счет'} type={'input'}
                                   name={'responsibleForDamage.organization.checkingAccount'}/>
                        </Col>
                        <Col xs={3}><Field
                            defaultValue={get(data, 'data.result.responsibleForDamage.organization.ownershipFormId')}
                            label={'Форма собственности'}
                            options={ownershipFormList}
                            type={'select'}
                            disabled
                            name={'responsibleForDamage.organization.ownershipFormId'}/></Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                defaultValue={210}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                disabled
                                name={'responsibleForDamage.organization.countryId'}/>
                        </Col>
                        <Col xs={3}><Field
                            defaultValue={get(data, 'data.result.responsibleForDamage.organization.regionId')}
                            label={'Область'} params={{required: true}} options={regionList}
                            type={'select'}
                            disabled
                            name={'responsibleForDamage.organization.regionId'}/></Col>
                        <Col xs={3} className={'mb-25'}>
                            <Field
                                disabled
                                params={{required: true}}
                                options={districtList}
                                defaultValue={get(data, 'data.result.responsibleForDamage.organization.districtId')}
                                label={'District'}
                                type={'select'}
                                name={'responsibleForDamage.organization.districtId'}/>
                        </Col>
                        <Col xs={6} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                property={{disabled: true}}
                                defaultValue={get(data, 'data.result.responsibleForDamage.organization.address')}
                                label={'Address'}
                                type={'input'}
                                name={'responsibleForDamage.organization.address'}/>
                        </Col>
                    </>}
                </Row>
                {get(data, 'data.result.responsibleVehicleInfo') && <Row gutterWidth={60} className={'mt-30'}>
                    <Col xs={12} className={'mb-15'}><Title>ТС виновного лица:</Title></Col>

                    <Col xs={4} style={{borderRight: '1px solid #DFDFDF'}}>

                        <Row align={'center'} className={'mb-25'}>
                            <Col xs={5}>Государственный номер</Col>
                            <Col xs={7}><Field
                                defaultValue={get(data, 'data.result.responsibleVehicleInfo.govNumber')}
                                property={{hideLabel: true, disabled: true}}
                                type={'input'}
                                name={'data.result.responsibleVehicleInfo.govNumber'}/></Col>
                        </Row>
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
                    get(data, 'data.result.responsibleVehicleInfo') && (get(data, 'data.result.responsibleVehicleInfo.insurantIsOwner') ?
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
                                                    name={'responsibleVehicleInfo.person.passportData.seria'}
                                                    type={'input-mask'}
                                                    defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.seria')}
                                                />
                                                <Field disabled property={{
                                                    hideLabel: true,
                                                    mask: '9999999',
                                                    placeholder: '1234567',
                                                    maskChar: '_',
                                                }} name={'responsibleVehicleInfo.person.passportData.number'}
                                                       type={'input-mask'}
                                                       defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.number')}
                                                />

                                                <Field className={'ml-15'}
                                                       disabled
                                                       property={{
                                                           hideLabel: true,
                                                           placeholder: 'Дата рождения',
                                                       }}
                                                       name={'responsibleVehicleInfo.person.birthDate'} type={'datepicker'}
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
                                                    }} name={'responsibleVehicleInfo.organization.inn'} type={'input-mask'}/>

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
                                           name={'responsibleVehicleInfo.person.fullName.lastname'}
                                           property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.person.fullName.firstname')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.person.fullName.firstname'}
                                           property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.person.fullName.middlename')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.person.fullName.middlename'}
                                           property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field disabled params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'responsibleVehicleInfo.person.passportData.startDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}} params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.person.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.person.passportData.pinfl')}
                                           label={'ПИНФЛ'} type={'input'}
                                           name={'responsibleVehicleInfo.person.passportData.pinfl'}/>
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
                                        name={'responsibleVehicleInfo.person.email'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={residentTypeList}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.residentType')}
                                        label={'Resident type'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.person.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.driverLicenseSeria')}
                                        label={'Серия вод. удостоверения'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.person.driverLicenseSeria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.driverLicenseNumber')}
                                        label={'Номер вод. удостоверения'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.person.driverLicenseNumber'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.countryId', 210)}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'responsibleVehicleInfo.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={regionList}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.person.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.person.districtId'}/>
                                </Col>

                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.person.address')}
                                        label={'Address'}
                                        type={'input'}
                                        property={{disabled: true}}
                                        name={'responsibleVehicleInfo.person.address'}/>
                                </Col>
                            </>}
                            {get(data, 'data.result.responsibleForDamage.organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleForDamage.organization.name')}
                                           label={'Наименование'} type={'input'}
                                           property={{disabled: true}}
                                           name={'responsibleVehicleInfo.organization.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleForDamage.organization.representativeName')}
                                        label={'Руководитель'} type={'input'}
                                        property={{disabled: true}}
                                        name={'responsibleVehicleInfo.organization.representativeName'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleForDamage.organization.position')}
                                        label={'Должность'} type={'input'}
                                        property={{disabled: true}}
                                        name={'responsibleVehicleInfo.organization.position'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleForDamage.organization.email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.organization.email'}
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
                                        name={'responsibleVehicleInfo.organization.phone'}/>
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
                                           name={'responsibleVehicleInfo.organization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field
                                    defaultValue={get(data, 'data.result.responsibleForDamage.organization.ownershipFormId')}
                                    label={'Форма собственности'}
                                    options={ownershipFormList}
                                    type={'select'}
                                    disabled
                                    name={'responsibleVehicleInfo.organization.ownershipFormId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={210}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        disabled
                                        name={'responsibleVehicleInfo.organization.countryId'}/>
                                </Col>
                                <Col xs={3}><Field
                                    defaultValue={get(data, 'data.result.responsibleForDamage.organization.regionId')}
                                    label={'Область'} params={{required: true}} options={regionList}
                                    type={'select'}
                                    disabled
                                    name={'responsibleVehicleInfo.organization.regionId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.organization.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.organization.districtId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.responsibleForDamage.organization.address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.organization.address'}/>
                                </Col>
                            </>}
                        </Row> :
                        <Row gutterWidth={60} className={'mt-30'}>
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
                                                    name={'responsibleVehicleInfo.person.passportData.seria'}
                                                    type={'input-mask'}
                                                    defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.passportData.seria')}
                                                />
                                                <Field disabled property={{
                                                    hideLabel: true,
                                                    mask: '9999999',
                                                    placeholder: '1234567',
                                                    maskChar: '_',
                                                }} name={'responsibleVehicleInfo.person.passportData.number'}
                                                       type={'input-mask'}
                                                       defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.passportData.number')}
                                                />

                                                <Field className={'ml-15'}
                                                       disabled
                                                       property={{
                                                           hideLabel: true,
                                                           placeholder: 'Дата рождения',
                                                       }}
                                                       name={'responsibleVehicleInfo.person.birthDate'} type={'datepicker'}
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
                                                    }} name={'responsibleVehicleInfo.organization.inn'} type={'input-mask'}/>

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
                                           name={'responsibleVehicleInfo.person.fullName.lastname'}
                                           property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.fullName.firstname')}
                                           label={'Firstname'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.person.fullName.firstname'}
                                           property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.fullName.middlename')}
                                           label={'Middlename'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.person.fullName.middlename'}
                                           property={{disabled: true}}
                                    />
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field disabled params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.passportData.startDate')}
                                           label={'Дата выдачи паспорта'}
                                           type={'datepicker'}
                                           name={'responsibleVehicleInfo.person.passportData.startDate'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}} params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.passportData.issuedBy')}
                                           label={'Кем выдан'}
                                           type={'input'}
                                           name={'responsibleVehicleInfo.person.passportData.issuedBy'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.gender')}
                                        options={genderList}
                                        label={'Gender'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.person.gender'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.passportData.pinfl')}
                                           label={'ПИНФЛ'} type={'input'}
                                           name={'responsibleVehicleInfo.person.passportData.pinfl'}/>
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
                                        name={'responsibleVehicleInfo.person.phone'}/>
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
                                        name={'responsibleVehicleInfo.person.residentType'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.driverLicenseSeria')}
                                        label={'Серия вод. удостоверения'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.person.driverLicenseSeria'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.driverLicenseNumber')}
                                        label={'Номер вод. удостоверения'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.person.driverLicenseNumber'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.countryId', 210)}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        name={'responsibleVehicleInfo.person.countryId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={regionList}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.regionId')}
                                        label={'Region'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.person.regionId'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.person.districtId'}/>
                                </Col>

                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.person.address')}
                                        label={'Address'}
                                        type={'input'}
                                        property={{disabled: true}}
                                        name={'responsibleVehicleInfo.person.address'}/>
                                </Col>
                            </>}
                            {get(data, 'data.result.responsibleVehicleInfo.organization') && <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.name')}
                                           label={'Наименование'} type={'input'}
                                           property={{disabled: true}}
                                           name={'responsibleVehicleInfo.organization.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.representativeName')}
                                        label={'Руководитель'} type={'input'}
                                        property={{disabled: true}}
                                        name={'responsibleVehicleInfo.organization.representativeName'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.position')}
                                        label={'Должность'} type={'input'}
                                        property={{disabled: true}}
                                        name={'responsibleVehicleInfo.organization.position'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.email')}
                                        label={'Email'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.organization.email'}
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
                                           name={'responsibleVehicleInfo.organization.phone'}/>
                                </Col>
                                <Col xs={3}><Field disabled
                                                   defaultValue={parseInt(get(data, 'data.result.responsibleVehicleInfo.organization.oked'))}
                                                   label={'Oked'} params={{required: true, valueAsString: true}}
                                                   options={okedList}
                                                   type={'select'}
                                                   name={'responsibleVehicleInfo.organization.oked'}/></Col>

                                <Col xs={3} className={'mb-25'}>
                                    <Field property={{disabled: true}}
                                           defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.checkingAccount')}
                                           label={'Расчетный счет'} type={'input'}
                                           name={'responsibleVehicleInfo.organization.checkingAccount'}/>
                                </Col>
                                <Col xs={3}><Field
                                    defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.ownershipFormId')}
                                    label={'Форма собственности'}
                                    options={ownershipFormList}
                                    type={'select'}
                                    disabled
                                    name={'responsibleVehicleInfo.organization.ownershipFormId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        params={{required: true}}
                                        defaultValue={210}
                                        label={'Country'}
                                        type={'select'}
                                        options={countryList}
                                        disabled
                                        name={'responsibleVehicleInfo.organization.countryId'}/>
                                </Col>
                                <Col xs={3}><Field
                                    defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.regionId')}
                                    label={'Область'} params={{required: true}} options={regionList}
                                    type={'select'}
                                    disabled
                                    name={'responsibleVehicleInfo.organization.regionId'}/></Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field
                                        disabled
                                        params={{required: true}}
                                        options={districtList}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.districtId')}
                                        label={'District'}
                                        type={'select'}
                                        name={'responsibleVehicleInfo.organization.districtId'}/>
                                </Col>
                                <Col xs={6} className={'mb-25'}>
                                    <Field
                                        noMaxWidth
                                        params={{required: true}}
                                        property={{disabled: true}}
                                        defaultValue={get(data, 'data.result.responsibleVehicleInfo.organization.address')}
                                        label={'Address'}
                                        type={'input'}
                                        name={'responsibleVehicleInfo.organization.address'}/>
                                </Col>
                            </>}
                        </Row>)
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
                                   thead={['№ ', 'Описание имущества', 'Размер вреда']}>
                                {
                                    get(data, 'data.result.otherPropertyDamage', []).map((item, index) => <tr>
                                        <td>{index + 1}</td>
                                        <td>{get(item, 'property')}</td>
                                        <td>{get(item, 'claimedDamage')}</td>
                                    </tr>)
                                }
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Form>
            <Modal title={'Принять решение'} hide={() => setOpen(false)} visible={open}>
                <Form
                    formRequest={acceptDecision}
                    footer={<Flex className={'mt-32'}><Button>Принять</Button></Flex>}>
                    <Row align={'end'}>
                        <Col xs={12} className={' mt-15'}>
                            <Row>
                                <Col xs={3}>
                                    <Field params={{required: true}}
                                           label={'Принятое решение'}
                                           type={'select'}
                                           options={decisionList}
                                           name={'decision.decisionId'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        label={'Причина отказа'}
                                        type={'input'}
                                        name={'decision.rejectionReason'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field params={{required: true}}
                                           label={'Номер протокола'}
                                           type={'input'}
                                           name={'decision.reasonForPayment'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field params={{required: true}}
                                           label={'Дата решения'}
                                           type={'datepicker'}
                                           name={'decision.decisionDate'}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Form>
            </Modal>
            <Modal title={'Редактирование решения'} hide={() => setOpenEditModal(false)} visible={openEditModal}>
                <Form
                    formRequest={editDecision}
                    footer={<Flex className={'mt-32'}><Button>Сохранять</Button></Flex>}>
                    <Row align={'end'}>
                        <Col xs={12} className={' mt-15'}>
                            <Row>
                                <Col xs={3}>
                                    <Field params={{required: true}}
                                           label={'Принятое решение'}
                                           type={'select'}
                                           options={decisionList}
                                           defaultValue={get(decision,'data.result.decision.decisionId')}
                                           name={'decision.decisionId'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field
                                        label={'Причина отказа'}
                                        type={'input'}
                                        defaultValue={get(decision,'data.result.decision.rejectionReason')}
                                        name={'decision.rejectionReason'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field params={{required: true}}
                                           label={'Номер протокола'}
                                           type={'input'}
                                           defaultValue={get(decision,'data.result.decision.reasonForPayment')}
                                           name={'decision.reasonForPayment'}/>
                                </Col>
                                <Col xs={3}>
                                    <Field params={{required: true}}
                                           label={'Дата решения'}
                                           type={'datepicker'}
                                           defaultValue={get(decision,'data.result.decision.decisionDate')}
                                           name={'decision.decisionDate'}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Form>
            </Modal>
            <Modal title={'Оплата'} hide={() => setOpenPaymentModal(false)} visible={openPaymentModal}>
                <Form
                    formRequest={payment}
                    footer={<Flex className={'mt-32'}><Button>Сохранить</Button></Flex>}>

                  <Row>
                    <Col xs={12}>
                        <Row className={"mb-15 mt-15"}>
                            <Col xs={8}>
                                <h2 >Выплата по жизни:</h2>
                            </Col>
                            <Col xs={4} className={"text-right"}>
                                <Button onClick={() => setLifePayoutsCount(prev => ++prev)} sm type={"button"}
                                        inline><Plus/></Button>
                            </Col>
                        </Row>
                        {range(0, lifePayoutsCount).map((count, i) => <Row className={'mb-15'} align={'flex-end'}>
                            <Col xs={11}>
                                <Row>
                                    <Col xs={3}>
                                        <Field name={`lifePayouts[${count}].payoutSum`} type={'input'} property={{type:'number'}}
                                               label={'Размер выплаты'}
                                               params={{required: true}}/>
                                    </Col>
                                    <Col xs={3}>
                                        <Field name={`lifePayouts[${count}].payoutDate`} type={'datepicker'}
                                               label={'Дата выплаты'}
                                               params={{required: true}}/>
                                    </Col>
                                    <Col xs={3}>
                                        <Field name={`lifePayouts[${count}].paymentOrderNumber`} type={'input'}
                                               label={'Номер платежного поручения'}
                                               params={{required: true}}/>
                                    </Col>
                                    <Col xs={3}>
                                        <Field name={`lifePayouts[${count}].recipient`} type={'input'}
                                               label={'ФИО получателя'}
                                               params={{required: true}}/>
                                    </Col>
                                    <Col xs={6} className={'mt-15'}>
                                        <Field name={`lifePayouts[${count}].inheritanceDocumentNumberAndDate`}
                                               type={'input'}
                                               label={'Номер и дата документа, подтверждающего наследство или правопреемство'}
                                               params={{required: true}}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={1} className={'text-right'}>
                                <Button onClick={() => setLifePayoutsCount(prev => --prev)} sm type={"button"}
                                        danger inline><Minus/></Button>
                            </Col>

                        </Row>)}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Row className={"mb-15 mt-15"}>
                            <Col xs={8}>
                                <h2>Выплата по здоровью:</h2>
                            </Col>
                            <Col xs={4} className={"text-right"}>
                                <Button onClick={() => setHealthPayoutsCount(prev => ++prev)} sm type={"button"}
                                        inline><Plus/></Button>
                            </Col>
                        </Row>
                        {range(0, healthPayoutsCount).map((count, i) => <Row className={'mb-15'} align={'flex-end'}>
                            <Col xs={11}>
                                <Row>
                                    <Col xs={3}>
                                        <Field name={`healthPayouts[${count}].payoutSum`} property={{type:'number'}}
                                               type={'input'}
                                               label={'Размер выплаты'}
                                               params={{required: true}}/>
                                    </Col>
                                    <Col xs={3}>
                                        <Field name={`healthPayouts[${count}].payoutDate`} type={'datepicker'}
                                               label={'Дата выплаты'}
                                               params={{required: true}}/>
                                    </Col>
                                    <Col xs={3}>
                                        <Field name={`healthPayouts[${count}].paymentOrderNumber`} type={'input'}
                                               label={'Номер платежного поручения'}
                                               params={{required: true}}/>
                                    </Col>
                                    <Col xs={3}>
                                        <Field name={`healthPayouts[${count}].recipient`} type={'input'}
                                               label={'ФИО получателя'}
                                               params={{required: true}}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={1} className={'text-right'}>
                                <Button onClick={() => setHealthPayoutsCount(prev => --prev)} sm type={"button"}
                                        danger inline><Minus/></Button>
                            </Col>

                        </Row>)}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Row className={"mb-15 mt-15"}>
                            <Col xs={8}>
                                <h2>Выплата по иному имуществу:</h2>
                            </Col>
                            <Col xs={4} className={"text-right"}>
                                <Button onClick={() => setOtherPropertyPayoutsCount(prev => ++prev)} sm
                                        type={"button"}
                                        inline><Plus/></Button>
                            </Col>
                        </Row>
                        {range(0, otherPropertyPayoutsCount).map((count, i) => <Row className={'mb-15'}
                                                                                    align={'flex-end'}>
                            <Col xs={11}>
                                <Row>
                                    <Col xs={3}>
                                        <Field name={`otherPropertyPayouts[${count}].payoutSum`} type={'input'} property={{type:'number'}}
                                               label={'Размер выплаты'}
                                               params={{required: true}}/>
                                    </Col>
                                    <Col xs={3}>
                                        <Field name={`otherPropertyPayouts[${count}].payoutDate`}
                                               type={'datepicker'}
                                               label={'Дата выплаты'}
                                               params={{required: true}}/>
                                    </Col>
                                    <Col xs={3}>
                                        <Field name={`otherPropertyPayouts[${count}].paymentOrderNumber`}
                                               type={'input'}
                                               label={'Номер платежного поручения'}
                                               params={{required: true}}/>
                                    </Col>
                                    <Col xs={3}>
                                        <Field name={`otherPropertyPayouts[${count}].recipient`} type={'input'}
                                               label={'ФИО получателя'}
                                               params={{required: true}}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={1} className={'text-right'}>
                                <Button onClick={() => setOtherPropertyPayoutsCount(prev => --prev)} sm
                                        type={"button"}
                                        danger inline><Minus/></Button>
                            </Col>

                        </Row>)}
                    </Col>
                </Row>
                </Form>
            </Modal>

            <Modal title={'Редактировать оплаты'} hide={() => setOpenPaymentEditModal(false)} visible={openPaymentEditModal}>
                <Form
                    formRequest={editPayment}
                    footer={<Flex className={'mt-32'}><Button>Сохранить</Button></Flex>}>

                    <Row>
                        <Col xs={12}>
                            <Row className={"mb-15 mt-15"}>
                                <Col xs={8}>
                                    <h2 >Выплата по жизни:</h2>
                                </Col>
                                <Col xs={4} className={"text-right"}>
                                    <Button onClick={() => setLifePayoutsCount(prev => ++prev)} sm type={"button"}
                                            inline><Plus/></Button>
                                </Col>
                            </Row>
                            {range(0, lifePayoutsCount).map((count, i) => <Row className={'mb-15'} align={'flex-end'}>
                                <Col xs={11}>
                                    <Row>
                                        <Col xs={3}>
                                            <Field name={`lifePayouts[${count}].payoutSum`} type={'input'} property={{type:'number'}}
                                                   defaultValue={get(paymentData,`data.result.lifePayouts[${count}].payoutSum`)}
                                                   label={'Размер выплаты'}
                                                   params={{required: true}}/>
                                        </Col>
                                        <Col xs={3}>
                                            <Field name={`lifePayouts[${count}].payoutDate`} type={'datepicker'}
                                                   defaultValue={get(paymentData,`data.result.lifePayouts[${count}].payoutDate`)}
                                                   label={'Дата выплаты'}
                                                   params={{required: true}}/>
                                        </Col>
                                        <Col xs={3}>
                                            <Field name={`lifePayouts[${count}].paymentOrderNumber`} type={'input'}
                                                   defaultValue={get(paymentData,`data.result.lifePayouts[${count}].paymentOrderNumber`)}
                                                   label={'Номер платежного поручения'}
                                                   params={{required: true}}/>
                                        </Col>
                                        <Col xs={3}>
                                            <Field name={`lifePayouts[${count}].recipient`} type={'input'}
                                                   defaultValue={get(paymentData,`data.result.lifePayouts[${count}].recipient`)}
                                                   label={'ФИО получателя'}
                                                   params={{required: true}}/>
                                        </Col>
                                        <Col xs={6} className={'mt-15'}>
                                            <Field name={`lifePayouts[${count}].inheritanceDocumentNumberAndDate`}
                                                   defaultValue={get(paymentData,`data.result.lifePayouts[${count}].inheritanceDocumentNumberAndDate`)}
                                                   type={'input'}
                                                   label={'Номер и дата документа, подтверждающего наследство или правопреемство'}
                                                   params={{required: true}}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={1} className={'text-right'}>
                                    <Button onClick={() => setLifePayoutsCount(prev => --prev)} sm type={"button"}
                                            danger inline><Minus/></Button>
                                </Col>

                            </Row>)}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Row className={"mb-15 mt-15"}>
                                <Col xs={8}>
                                    <h2>Выплата по здоровью:</h2>
                                </Col>
                                <Col xs={4} className={"text-right"}>
                                    <Button onClick={() => setHealthPayoutsCount(prev => ++prev)} sm type={"button"}
                                            inline><Plus/></Button>
                                </Col>
                            </Row>
                            {range(0, healthPayoutsCount).map((count, i) => <Row className={'mb-15'} align={'flex-end'}>
                                <Col xs={11}>
                                    <Row>
                                        <Col xs={3}>
                                            <Field name={`healthPayouts[${count}].payoutSum`} property={{type:'number'}}
                                                   defaultValue={get(paymentData,`data.result.healthPayouts[${count}].payoutSum`)}
                                                   type={'input'}
                                                   label={'Размер выплаты'}
                                                   params={{required: true}}/>
                                        </Col>
                                        <Col xs={3}>
                                            <Field name={`healthPayouts[${count}].payoutDate`} type={'datepicker'}
                                                   defaultValue={get(paymentData,`data.result.healthPayouts[${count}].payoutDate`)}
                                                   label={'Дата выплаты'}
                                                   params={{required: true}}/>
                                        </Col>
                                        <Col xs={3}>
                                            <Field name={`healthPayouts[${count}].paymentOrderNumber`} type={'input'}
                                                   defaultValue={get(paymentData,`data.result.healthPayouts[${count}].paymentOrderNumber`)}
                                                   label={'Номер платежного поручения'}
                                                   params={{required: true}}/>
                                        </Col>
                                        <Col xs={3}>
                                            <Field name={`healthPayouts[${count}].recipient`} type={'input'}
                                                   defaultValue={get(paymentData,`data.result.healthPayouts[${count}].recipient`)}
                                                   label={'ФИО получателя'}
                                                   params={{required: true}}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={1} className={'text-right'}>
                                    <Button onClick={() => setHealthPayoutsCount(prev => --prev)} sm type={"button"}
                                            danger inline><Minus/></Button>
                                </Col>

                            </Row>)}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Row className={"mb-15 mt-15"}>
                                <Col xs={8}>
                                    <h2>Выплата по иному имуществу:</h2>
                                </Col>
                                <Col xs={4} className={"text-right"}>
                                    <Button onClick={() => setOtherPropertyPayoutsCount(prev => ++prev)} sm
                                            type={"button"}
                                            inline><Plus/></Button>
                                </Col>
                            </Row>
                            {range(0, otherPropertyPayoutsCount).map((count, i) => <Row className={'mb-15'}
                                                                                        align={'flex-end'}>
                                <Col xs={11}>
                                    <Row>
                                        <Col xs={3}>
                                            <Field name={`otherPropertyPayouts[${count}].payoutSum`} type={'input'} property={{type:'number'}}
                                                   defaultValue={get(paymentData,`data.result.otherPropertyPayouts[${count}].payoutSum`)}
                                                   label={'Размер выплаты'}
                                                   params={{required: true}}/>
                                        </Col>
                                        <Col xs={3}>
                                            <Field name={`otherPropertyPayouts[${count}].payoutDate`}
                                                   defaultValue={get(paymentData,`data.result.otherPropertyPayouts[${count}].payoutDate`)}
                                                   type={'datepicker'}
                                                   label={'Дата выплаты'}
                                                   params={{required: true}}/>
                                        </Col>
                                        <Col xs={3}>
                                            <Field name={`otherPropertyPayouts[${count}].paymentOrderNumber`}
                                                   defaultValue={get(paymentData,`data.result.otherPropertyPayouts[${count}].paymentOrderNumber`)}
                                                   type={'input'}
                                                   label={'Номер платежного поручения'}
                                                   params={{required: true}}/>
                                        </Col>
                                        <Col xs={3}>
                                            <Field name={`otherPropertyPayouts[${count}].recipient`} type={'input'}
                                                   defaultValue={get(paymentData,`data.result.otherPropertyPayouts[${count}].recipient`)}
                                                   label={'ФИО получателя'}
                                                   params={{required: true}}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={1} className={'text-right'}>
                                    <Button onClick={() => setOtherPropertyPayoutsCount(prev => --prev)} sm
                                            type={"button"}
                                            danger inline><Minus/></Button>
                                </Col>

                            </Row>)}
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Section>
    </>);
};

export default ViewContainer;
