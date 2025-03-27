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

const ListContainer = ({...rest}) => {
    const {t} = useTranslation()
    const navigate = useNavigate();
    const [filter, setFilter] = useState({

    });
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Home',
            path: '/claim',
        },
        {
            id: 2,
            title: 'Claims',
            path: '/claim',
        }
    ], [])

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
                        render: ({value})=>dayjs(value).format("YYYY-MM-DD")
                    },
                    {
                        id: 67,
                        key: 'eventCircumstances.eventDateTime',
                        title: 'Время события',
                        render: ({value})=>dayjs(value).format("HH:mm")
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
                    },

                ]}
                keyId={[KEYS.list,filter]}
                url={URLS.list}
                title={t('Claims')}
                responseDataKey={'result.docs'}
                viewUrl={'/claim/view'}
                createUrl={'/claim/create'}
                updateUrl={'/claim/update'}
                isHideColumn
                dataKey={'claimFormId'}
                deleteUrl={URLS.remove}
                deleteParam={'claimFormId'}
params={{...filter}}
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
            </Form>}

            />
        </>
    );
};

export default ListContainer;
