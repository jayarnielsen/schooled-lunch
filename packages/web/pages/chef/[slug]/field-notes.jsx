import React from 'react';
import PropTypes from 'prop-types';
import ChefProfileQuery from '../../../graphql/ChefProfile.graphql';
import Page from '../../../layouts/Profile';
import FieldNotes from '../../../components/Profile/FieldNotes';

const ProfilePage = ({ chef }) => {
  return (
    <Page chef={chef} tab="field-notes">
      <FieldNotes />
    </Page>
  );
};

ProfilePage.getInitialProps = async ({ query, apolloClient }) => {
  const { slug } = query;
  const { data } = await apolloClient.query({
    query: ChefProfileQuery,
    variables: {
      slug,
    },
  });
  return {
    chef: data.user,
  };
};

ProfilePage.propTypes = {
  chef: PropTypes.object,
};

export default ProfilePage;
