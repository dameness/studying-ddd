import { Slug } from './slug';

it('should be able to create a new slug frm text', () => {
  const slug = Slug.createFromText('Example question title');

  expect(slug.value).toEqual('example-question-title');
});
