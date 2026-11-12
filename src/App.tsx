import React, { useState, useEffect } from 'react';
import { Menu, ChevronRight, Sparkles } from 'lucide-react';
import {
  ActivePage,
  Student,
  School,
  Teacher,
  PPDOfficer,
  CustomModule,
  PdfDocument,
  ReadingStage,
} from './types';
import {
  getStudents,
  getSchools,
  getTeachers,
  getOfficers,
  getCustomModules,
  getPdfDocuments,
  getRecalibrationData,
  getSelectedSchool,
  setSelectedSchool,
  addStudent,
  updateStudent,
  deleteStudent,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  addOfficer,
  updateOfficer,
  deleteOfficer,
  addCustomModule,
  updateCustomModule,
  deleteCustomModule,
  addPdfDocument,
  deletePdfDocument,
  subscribeToStore,
} from './lib/storage';

// Layout Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

// Modals
import { StudentFormModal } from './components/StudentFormModal';
import { OfficerModal } from './components/OfficerModal';
import { ModuleModal } from './components/ModuleModal';

// Pages
import { AnalisisBacaan } from './pages/AnalisisBacaan';
import { RekalibrasiItqan } from './pages/RekalibrasiItqan';
import { IqraTracker } from './pages/IqraTracker';
import { Juz1to5 } from './pages/Juz1to5';
import { Juz6to10 } from './pages/Juz6to10';
import { Juz11to20 } from './pages/Juz11to20';
import { Juz21to25 } from './pages/Juz21to25';
import { Juz26to30Khatam } from './pages/Juz26to30Khatam';
import { UnitPendidikanIslam } from './pages/UnitPendidikanIslam';
import { DokumenPdfViewer } from './pages/DokumenPdfViewer';
import { TetapanPengurusan } from './pages/TetapanPengurusan';

export default function App() {
  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('analisis');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Store Entities
  const [students, setStudents] = useState<Student[]>(getStudents());
  const [schools, setSchools] = useState<School[]>(getSchools());
  const [teachers, setTeachers] = useState<Teacher[]>(getTeachers());
  const [officers, setOfficers] = useState<PPDOfficer[]>(getOfficers());
  const [customModules, setCustomModules] = useState<CustomModule[]>(getCustomModules());
  const [documents, setDocuments] = useState<PdfDocument[]>(getPdfDocuments());
  const [recalibrationData, setRecalibrationData] = useState(getRecalibrationData());
  const [selectedSchoolState, setSelectedSchoolState] = useState<string>(getSelectedSchool());

  // Modals State
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  const [officerModalType, setOfficerModalType] = useState<'officer' | 'teacher'>('officer');
  const [editingOfficer, setEditingOfficer] = useState<PPDOfficer | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setStudents(getStudents());
      setSchools(getSchools());
      setTeachers(getTeachers());
      setOfficers(getOfficers());
      setCustomModules(getCustomModules());
      setDocuments(getPdfDocuments());
      setRecalibrationData(getRecalibrationData());
      setSelectedSchoolState(getSelectedSchool());
    });
    return () => unsubscribe();
  }, []);

  const handleSchoolChange = (schoolName: string) => {
    setSelectedSchool(schoolName);
    setSelectedSchoolState(schoolName);
  };

  // Student Actions
  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = async (studentData: Omit<Student, 'id' | 'last_updated'>) => {
    if (editingStudent) {
      await updateStudent(editingStudent.id, studentData);
    } else {
      await addStudent(studentData);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    await deleteStudent(id);
  };

  const handlePromoteStage = async (student: Student, nextStage: ReadingStage) => {
    await updateStudent(student.id, { current_stage: nextStage });
  };

  // Officer / Teacher Actions
  const handleOpenAddOfficer = () => {
    setOfficerModalType('officer');
    setEditingOfficer(null);
    setIsOfficerModalOpen(true);
  };

  const handleOpenAddTeacher = () => {
    setOfficerModalType('teacher');
    setEditingTeacher(null);
    setIsOfficerModalOpen(true);
  };

  const handleEditOfficer = (officer: PPDOfficer) => {
    setOfficerModalType('officer');
    setEditingOfficer(officer);
    setIsOfficerModalOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setOfficerModalType('teacher');
    setEditingTeacher(teacher);
    setIsOfficerModalOpen(true);
  };

  const handleSaveOfficer = async (data: Omit<PPDOfficer, 'id'>) => {
    if (editingOfficer) {
      await updateOfficer(editingOfficer.id, data);
    } else {
      await addOfficer(data);
    }
  };

  const handleSaveTeacher = async (data: Omit<Teacher, 'id'>) => {
    if (editingTeacher) {
      await updateTeacher(editingTeacher.id, data);
    } else {
      await addTeacher(data);
    }
  };

  // Document Actions
  const handleAddDocument = async (data: Omit<PdfDocument, 'id' | 'date_added'>) => {
    await addPdfDocument(data);
  };

  const handleDeleteDocument = async (id: string) => {
    await deletePdfDocument(id);
  };

  // Custom Module Actions
  const handleAddModule = async (data: Omit<CustomModule, 'id'>) => {
    await addCustomModule(data);
  };

  const handleUpdateModule = async (id: string, updates: Partial<CustomModule>) => {
    await updateCustomModule(id, updates);
  };

  const handleDeleteModule = async (id: string) => {
    await deleteCustomModule(id);
  };

  // Render Page Content based on activePage
  const renderPage = () => {
    switch (activePage) {
      case 'analisis':
        return (
          <AnalisisBacaan
            students={students}
            schools={schools}
            selectedSchool={selectedSchoolState}
            onNavigate={(page) => setActivePage(page)}
            onOpenAddStudent={handleOpenAddStudent}
          />
        );
      case 'rekalibrasi-itqan':
        return (
          <RekalibrasiItqan
            recalibrationData={recalibrationData}
            students={students}
            schools={schools}
            selectedSchool={selectedSchoolState}
          />
        );
      case 'iqra':
        return (
          <IqraTracker
            students={students}
            selectedSchool={selectedSchoolState}
            onOpenAddStudent={handleOpenAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onPromoteStage={handlePromoteStage}
          />
        );
      case 'juz1-5':
        return (
          <Juz1to5
            students={students}
            selectedSchool={selectedSchoolState}
            onOpenAddStudent={handleOpenAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onPromoteStage={handlePromoteStage}
          />
        );
      case 'juz6-10':
        return (
          <Juz6to10
            students={students}
            selectedSchool={selectedSchoolState}
            onOpenAddStudent={handleOpenAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onPromoteStage={handlePromoteStage}
          />
        );
      case 'juz11-20':
        return (
          <Juz11to20
            students={students}
            selectedSchool={selectedSchoolState}
            onOpenAddStudent={handleOpenAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onPromoteStage={handlePromoteStage}
          />
        );
      case 'juz21-25':
        return (
          <Juz21to25
            students={students}
            selectedSchool={selectedSchoolState}
            onOpenAddStudent={handleOpenAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onPromoteStage={handlePromoteStage}
          />
        );
      case 'juz26-30-khatam':
        return (
          <Juz26to30Khatam
            students={students}
            selectedSchool={selectedSchoolState}
            onOpenAddStudent={handleOpenAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onPromoteStage={handlePromoteStage}
          />
        );
      case 'unit-pendidikan-islam':
        return (
          <UnitPendidikanIslam
            officers={officers}
            teachers={teachers}
            selectedSchool={selectedSchoolState}
            onOpenAddOfficer={handleOpenAddOfficer}
            onOpenAddTeacher={handleOpenAddTeacher}
            onEditOfficer={handleEditOfficer}
            onEditTeacher={handleEditTeacher}
            onDeleteOfficer={deleteOfficer}
            onDeleteTeacher={deleteTeacher}
          />
        );
      case 'dokumen-pdf':
        return (
          <DokumenPdfViewer
            documents={documents}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        );
      case 'tetapan':
        return (
          <TetapanPengurusan
            customModules={customModules}
            onAddModule={handleAddModule}
            onUpdateModule={handleUpdateModule}
            onDeleteModule={handleDeleteModule}
          />
        );
      default:
        // Handle any dynamic custom module added by user
        return (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Modul Khas PPD Penampang
            </h3>
            <p className="text-xs text-slate-600">
              Anda sedang melayari modul dinamik bagi sistem ini. Anda boleh mengurus modul di Tetapan Pengurusan.
            </p>
            <button
              onClick={() => setActivePage('analisis')}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
            >
              Kembali ke Analisis Bacaan
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      
      {/* Top Application Header */}
      <Header
        schools={schools}
        selectedSchool={selectedSchoolState}
        onSelectSchool={handleSchoolChange}
        onOpenAddStudent={handleOpenAddStudent}
        totalStudents={students.length}
      />

      {/* Mobile Bar for toggling sidebar and quick school display */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between no-print">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Menu className="w-4 h-4" />
          <span>Menu Navigasi</span>
        </button>

        <span className="text-[11px] font-semibold text-blue-600 truncate max-w-[180px]">
          {selectedSchoolState === 'SEMUA' ? 'PPD Penampang' : selectedSchoolState}
        </span>
      </div>

      {/* Main Content Layout (Sidebar + Viewport) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={(page) => setActivePage(page)}
          customModules={customModules}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          selectedSchool={selectedSchoolState}
          onSelectSchool={handleSchoolChange}
          schoolList={schools}
        />

        {/* Viewport Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderPage()}
        </main>

      </div>

      {/* Modals */}
      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleSaveStudent}
        initialData={editingStudent}
        schools={schools}
        teachers={teachers}
        defaultSchool={selectedSchoolState}
      />

      <OfficerModal
        isOpen={isOfficerModalOpen}
        onClose={() => {
          setIsOfficerModalOpen(false);
          setEditingOfficer(null);
          setEditingTeacher(null);
        }}
        type={officerModalType}
        onSubmitOfficer={handleSaveOfficer}
        onSubmitTeacher={handleSaveTeacher}
        initialOfficer={editingOfficer}
        initialTeacher={editingTeacher}
      />

    </div>
  );
}
