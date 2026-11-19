// Centralized API client for Frontend
import { ALL_COURSES_DATA } from '../../data/coursesData';
import { enrichCourseCatalog, enrichCourse } from '../../utils/courseMediaEnricher';

export interface ApiStats {
  coursesCount: number;
  lessonsCount: number;
  studentsCount: number;
  brandsCount: number;
  certificatesCount: number;
}

export const CoreApi = {
  async getPublicStats(): Promise<ApiStats | null> {
    try {
      const res = await fetch('/api/v1/stats/public');
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.stats || { coursesCount: 50, lessonsCount: 232, studentsCount: 450, brandsCount: 26, certificatesCount: 85 };
    } catch (e) {
      return { coursesCount: 50, lessonsCount: 232, studentsCount: 450, brandsCount: 26, certificatesCount: 85 };
    }
  },

  async getCourses() {
    try {
      const res = await fetch('/api/v1/courses');
      const data = await res.json();
      if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
        const localMap = new Map(ALL_COURSES_DATA.map(c => [c.id, c]));
        const merged = data.courses.map((dbCourse: any) => {
          const local = localMap.get(dbCourse.id);
          return {
            ...local,
            ...dbCourse,
            modules: (dbCourse.modules && dbCourse.modules.length > 0) ? dbCourse.modules : (local?.modules || [])
          };
        });
        return enrichCourseCatalog(merged);
      }
      return enrichCourseCatalog(ALL_COURSES_DATA);
    } catch (e) {
      console.error(e);
      return enrichCourseCatalog(ALL_COURSES_DATA);
    }
  },

  async getCourseById(id: string) {
    try {
      const res = await fetch(`/api/v1/courses/${id}`);
      const data = await res.json();
      const local = ALL_COURSES_DATA.find(c => c.id === id);
      if (data.course) {
        const merged = {
          ...local,
          ...data.course,
          modules: (data.course.modules && data.course.modules.length > 0) ? data.course.modules : (local?.modules || [])
        };
        return enrichCourse(merged);
      }
      return local ? enrichCourse(local) : null;
    } catch (e) {
      console.error(e);
      const local = ALL_COURSES_DATA.find(c => c.id === id);
      return local ? enrichCourse(local) : null;
    }
  },

  async getCategories() {
    try {
      const res = await fetch('/api/v1/categories');
      const data = await res.json();
      return data.categories || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getBrands() {
    try {
      const res = await fetch('/api/v1/vehicles/brands');
      const data = await res.json();
      return data.brands || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getModels(brandId?: string) {
    try {
      const url = brandId ? `/api/v1/vehicles/models?brandId=${brandId}` : '/api/v1/vehicles/models';
      const res = await fetch(url);
      const data = await res.json();
      return data.models || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getGenerations(modelId: string) {
    try {
      const res = await fetch(`/api/v1/vehicles/generations?modelId=${modelId}`);
      const data = await res.json();
      return data.generations || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getEngines(modelId?: string) {
    try {
      const url = modelId ? `/api/v1/vehicles/engines?modelId=${modelId}` : '/api/v1/vehicles/engines';
      const res = await fetch(url);
      const data = await res.json();
      return data.engines || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getTransmissions(modelId?: string) {
    try {
      const url = modelId ? `/api/v1/vehicles/transmissions?modelId=${modelId}` : '/api/v1/vehicles/transmissions';
      const res = await fetch(url);
      const data = await res.json();
      return data.transmissions || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getSystems() {
    try {
      const res = await fetch('/api/v1/vehicles/systems');
      const data = await res.json();
      return data.systems || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getComponents(systemId?: string) {
    try {
      const url = systemId ? `/api/v1/vehicles/components?systemId=${systemId}` : '/api/v1/vehicles/components';
      const res = await fetch(url);
      const data = await res.json();
      return data.components || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getEcus() {
    try {
      const res = await fetch('/api/v1/vehicles/ecus');
      const data = await res.json();
      return data.ecus || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getDtcs() {
    try {
      const res = await fetch('/api/v1/dtcs');
      const data = await res.json();
      return data.dtcs || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getDtcByCode(code: string) {
    try {
      const res = await fetch(`/api/v1/dtcs/${code}`);
      const data = await res.json();
      return data.dtc || null;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async getCases() {
    try {
      const res = await fetch('/api/v1/cases');
      const data = await res.json();
      return data.cases || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getLabs() {
    try {
      const res = await fetch('/api/v1/labs');
      const data = await res.json();
      return data.labs || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }
};
