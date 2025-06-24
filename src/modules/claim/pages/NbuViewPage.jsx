import React from 'react';
import styled from "styled-components";
import {useParams} from "react-router-dom";
import NbuViewContainer from "../containers/NbuViewContainer";

const Styled = styled.div`
  .w-100 {
    & > div {
      width: 100%;
    }
  }

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
const NbuViewPage = ({...rest}) => {
    const {claimFormId  = null} = useParams();
    return (
        <Styled {...rest}>
            <NbuViewContainer claimFormId ={claimFormId }/>
        </Styled>
    );
};

export default NbuViewPage;
