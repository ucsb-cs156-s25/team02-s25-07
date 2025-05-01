import React from 'react';
import ArticlesForm from "main/components/Articles/ArticlesForm"
import { articlesFixtures } from 'fixtures/articlesFixtures';

export default {
    title: 'components/Articles/ArticlesForm',
    component: ArticlesForm
};

const Template = (args) => {
    return (
        <ArticlesForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    initialContents: articlesFixtures.oneArticle,
    submitText: "Update",
    submitAction: () => { console.log("Submit was clicked"); }
}; 