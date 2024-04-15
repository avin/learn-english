import React from 'react';
import AutoHeightContainer from '@/components/common/AutoHeightContainer/AutoHeightContainer.tsx';
import Spinner from '@/components/common/Spinner/Spinner.tsx';

interface Props {
}

const FullPageSpinner = ({}: Props) => {
  return (
      <AutoHeightContainer>
        <div className="h-full flex justify-center items-center">
          <Spinner color="#8a9ba8" size={48} />
        </div>
      </AutoHeightContainer>
  );
};

export default FullPageSpinner;