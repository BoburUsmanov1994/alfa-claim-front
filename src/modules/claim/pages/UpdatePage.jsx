import React from 'react';
import styled from "styled-components";
import {useParams} from "react-router-dom";
import UpdateContainer from "../containers/UpdateContainer";

const Styled = styled.div`
  .form-group {
    margin-bottom: 0;
  }

  .rodal-dialog {
    height: unset !important;
    max-height: 80vh !important;
    top: 50% !important;
    bottom: unset !important;
    transform: translateY(-50%);
    min-width: 1000px !important;
    max-width: 70% !important;
  }
`;
const UpdatePage = ({...rest}) => {
    const {claimFormId  = null} = useParams();
    return (
        <Styled {...rest}>
            <UpdateContainer claimFormId ={claimFormId }/>
        </Styled>
    );
};

export default UpdatePage;
