import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useTranslation} from "react-i18next";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import {Col, Row} from "react-grid-system";
import Button from "../../../components/ui/button";
import {Filter, Trash} from "react-feather";
import {useNavigate} from "react-router-dom";
import Form from "../../../containers/form/form";
import {Flex} from "@chakra-ui/react";
import Modal from "../../../components/modal";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {ContentLoader, OverlayLoader} from "../../../components/loader";
import {getSelectOptionsListFromData, saveFile} from "../../../utils";

const NbuListContainer = () => {
    const {t} = useTranslation()
    const navigate = useNavigate();
    const [filter, setFilter] = useState({});
    const [claim, setClaim] = useState({upload: null, application: null, decision: null, payment: null});
    const {mutate: uploadClaim, isLoading:isLoadingUploadClaim} = usePostQuery({listKeyId: [KEYS.list, filter]})
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const {data: decisions} = useGetAllQuery({
        key: KEYS.decisions, url: URLS.decisions
    })
    const decisionList = getSelectOptionsListFromData(get(decisions, `data.result`, []), 'id', 'name')
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Home',
            path: '/claim',
        },
        {
            id: 2,
            title: 'Claims (NBU)',
            path: '/claim',
        }
    ], [])

    const upload = ({data}) => {
       let formData = new FormData();
       formData.append("file", get(data,'file'));
       formData.append("claimDate", get(data,'claimDate'));
       formData.append("claimNumber", get(data,'claimNumber'));
        uploadClaim({
            url: URLS.uploadClaimNbu, attributes: formData,
            config: {
                responseType:'blob',
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        },{
            onSuccess: (res) => {
                console.log('res',res)
                setClaim({})
                saveFile(get(res,'data'))
            }
        })
    }
    const uploadApplicant = ({data}) => {
        let formData = new FormData();
        formData.append("file", get(data,'file'));
        formData.append("claimNumber", get(data,'claimNumber'));
        uploadClaim({
            url: URLS.uploadApplicantClaimNbu, attributes: formData
        },{
            onSuccess: (data) => {
                setClaim({})
                saveFile(get(data,'data'))
            }
        })
    }
    const uploadDecision = ({data}) => {
        let formData = new FormData();
        formData.append("file", get(data,'file'));
        formData.append("file_fatf", get(data,'file_fatf'));
        formData.append("decisionId", get(data,'decisionId'));
        formData.append("rejectionReason", get(data,'rejectionReason'));
        formData.append("reasonForPayment", get(data,'reasonForPayment'));
        formData.append("decisionDate", get(data,'decisionDate'));
        formData.append("claimNumber", get(data,'claimNumber'));
        uploadClaim({
            url: URLS.uploadDecisionClaimNbu, attributes: formData
        },{
            onSuccess: (data) => {
                setClaim({})
                saveFile(get(data,'data'))
            }
        })
    }
    const uploadPayment = ({data}) => {
        let formData = new FormData();
        formData.append("file", get(data,'file'));
        formData.append("paymentOrderNumber", get(data,'paymentOrderNumber'));
        formData.append("claimNumber", get(data,'claimNumber'));
        formData.append("payoutDate", get(data,'payoutDate'));
        uploadClaim({
            url: URLS.uploadPaymentClaimNbu, attributes: formData
        },{
            onSuccess: (data) => {
                setClaim({})
                saveFile(get(data,'data'))
            }
        })
    }
    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'name'} type={'input'} label={'Название продукта'} defaultValue={rowId ? get(data, 'name') : null}
               params={{required: true}}/>
    </>

    return (
        <>
            <GridView

                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 3,
                        key: 'claimNumber',
                        title: 'Номер претензионного дела',
                    },
                    {
                        id: 4,
                        key: 'claimDate',
                        title: 'Дата претензионного дела',
                    },
                    {
                        id: 5,
                        key: 'polisSeria',
                        title: 'Серия полиса',
                    },
                    {
                        id: 6,
                        key: 'polisNumber',
                        title: 'Номер полиса',
                    },
                    {
                        id: 66,
                        key: 'eventCircumstances.eventDateTime',
                        title: 'Дата события',
                        render: ({value}) => dayjs(value).format("YYYY-MM-DD")
                    },
                    {
                        id: 67,
                        key: 'eventCircumstances.eventDateTime',
                        title: 'Время события',
                        render: ({value}) => dayjs(value).format("HH:mm")
                    },
                    {
                        id: 7,
                        key: 'sum',
                        title: 'Сумма выплаты',
                        render: ({value}) => <NumberFormat displayType={'text'} thousandSeparator={' '} value={value}/>
                    },
                    {
                        id: 9,
                        key: 'status',
                        title: 'Status',
                    }

                ]}
                keyId={[KEYS.list, filter]}
                url={URLS.list}
                title={t('Claims (NBU)')}
                responseDataKey={'result.docs'}
                isHideColumn
                dataKey={'claimFormId'}
                viewUrl={'/nbu/view'}
                deleteUrl={URLS.remove}
                deleteParam={'claimFormId'}
                params={{isNbuClaim: true, ...filter}}
                extraFilters={<Form formRequest={({data: {...rest} = {}}) => {
                    setFilter(rest);
                }}
                                    mainClassName={'mt-15'}>

                    <Row align={'flex-end'}>
                        <Col xs={3}>
                            <Field label={t('Claim number')} type={'input'}
                                   name={'claimNumber'}
                                   defaultValue={get(filter, 'claimNumber')}

                            />
                        </Col>

                        <Col xs={6}>
                            <div className="mb-25">

                                <Button htmlType={'submit'}><Flex justify={'center'}><Filter size={18}/><span
                                    style={{marginLeft: '5px'}}>{t("ПРИМЕНИТЬ")}</span></Flex></Button>
                                <Button onClick={() => {
                                    navigate(0)
                                }} className={'ml-15'} danger type={'button'}><Flex justify={'center'}><Trash
                                    size={18}/><span
                                    style={{marginLeft: '5px'}}>{t("ОЧИСТИТЬ")}</span></Flex></Button>
                            </div>
                        </Col>
                    </Row>
                    <Row align={'flex-end'}>
                        <Col xs={12}>
                            <Flex justify={'flex-end'}>
                                <Button
                                    green
                                    onClick={() => setClaim({upload: true})}
                                    type={'button'} className={'mr-16'}>Загрузка претензий</Button>
                                <Button
                                    green
                                    onClick={() => {
                                        setClaim({application: true})
                                    }}
                                    type={'button'} className={'mr-16'}>Загрузка заявления</Button>
                                <Button
                                    green
                                    onClick={() => {
                                        setClaim({decision: true})
                                    }}
                                    type={'button'} className={'mr-16'}>Загрузка решений</Button>
                                <Button
                                    green
                                    onClick={() => {
                                        setClaim({payment: true})
                                    }}
                                    type={'button'}>Загрузка оплаты</Button>
                            </Flex>
                        </Col>
                    </Row>
                </Form>}

            />
            <Modal title={'Загрузка претензий'} hide={() => setClaim({})} visible={get(claim, 'upload')}>
                <Form
                    formRequest={upload}
                    footer={<Flex className={'mt-32'}><Button>Импортировать и отправить в НАПП</Button></Flex>}>
                    {isLoadingUploadClaim && <OverlayLoader />}
                    <br/>
                    <Row>
                        <Col xs={4}>
                            <Field  name={`claimNumber`} type={'input'}
                                   label={'Номер основной претензии'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={`claimDate`} type={'datepicker'}
                                   label={'Дата претензионного дела'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field property={{hasRequiredLabel:true}} name={`file`} type={'upload'}
                                   label={'Файл претензий'}
                                   params={{required: true}}/>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal title={'Загрузка заявления'} hide={() => setClaim({})} visible={get(claim, 'application')}>
                <Form
                    formRequest={uploadApplicant}
                    footer={<Flex className={'mt-32'}><Button>Импортировать и отправить в НАПП</Button></Flex>}>
                    {isLoadingUploadClaim && <OverlayLoader />}
                    <br/>
                    <Row>
                        <Col xs={4}>
                            <Field  name={`claimNumber`} type={'input'}
                                    label={'Номер основной претензии'}
                                    params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field property={{hasRequiredLabel:true}} name={`file`} type={'upload'}
                                   label={'Файл заявления'}
                                   params={{required: true}}/>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal title={'Загрузка решений'} hide={() => setClaim({})} visible={get(claim, 'decision')}>
                <Form
                    formRequest={uploadDecision}
                    footer={<Flex className={'mt-32'}><Button>Принять решение и отправить в НАПП</Button></Flex>}>
                    {isLoadingUploadClaim && <OverlayLoader />}
                    <br/>
                    <Row>
                        <Col xs={4}>
                            <Field  name={`claimNumber`} type={'input'}
                                    label={'Номер основной претензии'}
                                    params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field params={{required: true}}
                                   label={'Принятое решение'}
                                   type={'select'}
                                   options={decisionList}
                                   name={'decisionId'}/>
                        </Col>
                        <Col xs={4}>
                            <Field
                                label={'Причина отказа'}
                                type={'input'}
                                name={'rejectionReason'}/>
                        </Col>
                        <Col xs={4}>
                            <Field params={{required: true}}
                                   label={'Номер протокола'}
                                   type={'input'}
                                   name={'reasonForPayment'}/>
                        </Col>
                        <Col xs={4}>
                            <Field params={{required: true}}
                                   label={'Дата решения'}
                                   type={'datepicker'}
                                   name={'decisionDate'}/>
                        </Col>
                        <Col xs={4}>
                            <Field property={{hasRequiredLabel:true}} name={`file`} type={'upload'}
                                   label={'Файл решения'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field property={{hasRequiredLabel:true}} name={`file_fatf`} type={'upload'}
                                   label={'Файл заключения ФАТФ'}
                                   params={{required: true}}/>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal title={'Загрузка оплаты'} hide={() => setClaim({})} visible={get(claim, 'payment')}>
                <Form
                    formRequest={uploadPayment}
                    footer={<Flex className={'mt-32'}><Button>Принять решение и отправить в НАПП</Button></Flex>}>
                    {isLoadingUploadClaim && <ContentLoader />}
                    <br/>
                    <Row>
                        <Col xs={4}>
                            <Field  name={`claimNumber`} type={'input'}
                                    label={'Номер основной претензии'}
                                    params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field  name={`payoutDate`} type={'datepicker'}
                                    label={'Дата выплаты'}
                                    />
                        </Col>
                        <Col xs={4}>
                            <Field  name={`paymentOrderNumber`} type={'input'}
                                    label={'Номер платежного поручения'}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field property={{hasRequiredLabel:true}} name={`file`} type={'upload'}
                                   label={'Файл выплаты'}
                                   params={{required: true}}/>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default NbuListContainer;
