import React from 'react';
import styled from "styled-components";
import NbuListContainer from "../containers/NbuListContainer";

const Styled = styled.div`
`;
const NbuListPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <NbuListContainer/>
        </Styled>
    );
};

export default NbuListPage;
