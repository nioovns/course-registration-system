
class CourseFilter:
    @staticmethod
    def apply(queryset, params):
        if 'code' in params:
            queryset = queryset.filter(code__icontains=params['code'])

        return queryset