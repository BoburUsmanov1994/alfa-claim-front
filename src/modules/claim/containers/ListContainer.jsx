import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useTranslation} from "react-i18next";
import NumberFormat from "react-number-format";

const ListContainer = ({...rest}) => {
    const {t} = useTranslation()

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
                    },
                    {
                        id: 67,
                        key: 'eventCircumstances.eventDateTime',
                        title: 'Время события',
                    },
                    {
                        id: 68,
                        key: 'eventCircumstances.eventDateTime',
                        title: '',
                    },
                    {
                        id: 7,
                        key: 'sum',
                        title: 'Insurance sum',
                        render: ({value}) => <NumberFormat displayType={'text'} thousandSeparator={' '} value={value}/>
                    },
                    {
                        id: 8,
                        key: 'premium',
                        title: 'Оплачено',
                        render: ({value, row}) => get(row, 'status') == 'payed' ?
                            <NumberFormat displayType={'text'} thousandSeparator={' '} value={value}/> : 0
                    },
                    {
                        id: 9,
                        key: 'status',
                        title: 'Status',
                    },

                ]}
                keyId={KEYS.list}
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

            />
        </>
    );
};

export default ListContainer;