import React, {useEffect, useMemo, useState} from 'react';
import {find, get, isEqual, isNil, round} from "lodash";
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
import {Eye} from "react-feather";
import Modal from "../../../components/modal";

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
                            <Col xs={7}><Field defaultValue={get(data, 'data.result.courtDecision.court')} property={{hideLabel: true,disabled:true}}
                                               type={'input'}
                                               name={'eventCircumstances.courtDecision.court'}/></Col>
                        </Row>
                    </Col>
                </Row>


            </Form>

        </Section>
    </>);
};

export default ViewContainer;