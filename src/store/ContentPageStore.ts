import {
  Instance,
  types,
  flow,
  cast,
  getSnapshot,
  SnapshotOut,
  SnapshotIn,
} from 'mobx-state-tree';
import i18n from '../i18n';
import api from '../services/api/Api';

const States = ['IDLE' as const, 'FETCHING' as const, 'ERROR' as const];

const PageModel = types.model({
  id: types.number,
  isPublic: types.boolean,
  title: types.maybeNull(types.string),
  lead: types.maybeNull(types.string),
  content: types.maybeNull(types.string),
});
export interface Page extends SnapshotOut<typeof PageModel> {}

const ContentPageModel = types.model({
  pages: types.array(PageModel),
});

export interface IContentPageModel extends Instance<typeof ContentPageModel> {}
export interface ContentPage extends SnapshotOut<typeof ContentPageModel> {}
export interface ContentPageIn extends SnapshotIn<typeof ContentPageModel> {}

export const ContentPageStore = types
  .model({
    state: types.enumeration('State', States),
    data: types.maybe(ContentPageModel),
  })
  .views(self => ({
    get pages() {
      return self.data ? getSnapshot(self.data) : undefined;
    },
    getPage(id: number) {
      const page = self.data?.pages.find(page => page.id === id);
      return page ? getSnapshot(page) : undefined;
    },
  }))
  .actions(self => {
    const fetchPage = flow(function* (params: API.GetContentPage) {
      self.state = 'FETCHING';

      const response: API.GeneralResponse<API.RES.GetContentPage> =
        yield api.getContentPage(params);

      const updatePages = (page: Page) => {
        const oldPages = self.data?.pages.filter(({ id }) => id !== page.id);
        return [...(oldPages ?? []), page];
      };

      if (response.kind === 'ok') {
        const page = response.data;
        const pages = updatePages(page);

        self.data = { ...self.data, pages: cast(pages) };
        self.state = 'IDLE';
      } else {
        const page: Page = {
          id: params.id,
          isPublic: true,
          title: i18n.t('error.page_not_found'),
          lead: null,
          content: null,
        };
        const pages = updatePages(page);
        self.data = { ...self.data, pages: cast(pages) };
        self.state = 'ERROR';
      }
    });

    return {
      fetchPage,
    };
  });

export interface IContentPageStore extends Instance<typeof ContentPageStore> {}
