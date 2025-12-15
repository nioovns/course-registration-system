from django import forms
from django.contrib.auth import get_user_model
from .models import Student, Professor

User = get_user_model()


class StudentCreationForm(forms.ModelForm):
    # فیلدهای اضافه برای ساخت یوزر
    username = forms.CharField(label="Username")
    password = forms.CharField(widget=forms.PasswordInput, label="Password")

    class Meta:
        model = Student
        fields = ['student_id', 'entry_year', 'first_name', 'last_name']

    def save(self, commit=True):
        # 1. اول اطلاعات دانشجو را نگه دار (هنوز در دیتابیس ذخیره نکن)
        student = super().save(commit=False)

        # 2. حالا یوزر را دستی بساز
        user = User.objects.create_user(
            username=self.cleaned_data['username'],
            password=self.cleaned_data['password'],
            first_name=self.cleaned_data['first_name'],
            last_name=self.cleaned_data['last_name'],
            role=User.Roles.STUDENT  # نقش را خودکار دانشجو بگذار
        )

        # 3. یوزر جدید را به دانشجو وصل کن
        student.user = user

        if commit:
            student.save()
        return student


class ProfessorCreationForm(forms.ModelForm):
    username = forms.CharField(label="Username")
    password = forms.CharField(widget=forms.PasswordInput, label="Password")

    class Meta:
        model = Professor
        fields = ['professor_code', 'email', 'first_name', 'last_name']

    def save(self, commit=True):
        professor = super().save(commit=False)

        user = User.objects.create_user(
            username=self.cleaned_data['username'],
            password=self.cleaned_data['password'],
            first_name=self.cleaned_data['first_name'],
            last_name=self.cleaned_data['last_name'],
            role=User.Roles.PROFESSOR  # نقش استاد
        )

        professor.user = user

        if commit:
            professor.save()
        return professor