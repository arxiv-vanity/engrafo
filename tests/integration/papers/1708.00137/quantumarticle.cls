%%
%% This is file `quantumarticle.cls',
%% it provides the quantumarticle class for typesetting articles in
%% Quantum - the open journal for quantum science
%%
%% Copyright 2016,2017,2018
%% Verein zur Förderung des Open Access Publizierens in den Quantenwissenschaften
%% (http://quantum-journal.org/about/)
%% 
%% It is derived from `article.cls' available from
%% https://www.ctan.org/pkg/article
%%
%% It may be distributed and/or modified under the
%% conditions of the LaTeX Project Public License, either version 1.3c
%% of this license or (at your option) any later version.
%% The latest version of this license is in
%%    http://www.latex-project.org/lppl.txt
%% and version 1.3c or later is part of all distributions of LaTeX
%% version 2005/12/01 or later.
%% 
\NeedsTeXFormat{LaTeX2e}[1995/12/01]
\ProvidesClass{quantumarticle}
              [2017/03/17 v4.1
               class for Quantum - the open journal for quantum science (http://quantum-journal.org)]
\RequirePackage{xkeyval}
\RequirePackage{etoolbox}
\newcommand\@ptsize{}
\newif\if@restonecol
\newif\if@titlepage
\@titlepagefalse
\if@compatibility\else
\DeclareOptionX{a4paper}
   {\setlength\paperheight {297mm}%
    \setlength\paperwidth  {210mm}}
\DeclareOptionX{a5paper}
   {\setlength\paperheight {210mm}%
    \setlength\paperwidth  {148mm}}
\DeclareOptionX{b5paper}
   {\setlength\paperheight {250mm}%
    \setlength\paperwidth  {176mm}}
\DeclareOptionX{letterpaper}
   {\setlength\paperheight {11in}%
    \setlength\paperwidth  {8.5in}}
\DeclareOptionX{legalpaper}
   {\setlength\paperheight {14in}%
    \setlength\paperwidth  {8.5in}}
\DeclareOptionX{executivepaper}
   {\setlength\paperheight {10.5in}%
    \setlength\paperwidth  {7.25in}}
\DeclareOptionX{landscape}
   {\setlength\@tempdima   {\paperheight}%
    \setlength\paperheight {\paperwidth}%
    \setlength\paperwidth  {\@tempdima}}
\fi
\if@compatibility
  \renewcommand\@ptsize{0}
\else
\DeclareOptionX{10pt}{\renewcommand\@ptsize{0}}
\fi
\DeclareOptionX{11pt}{\renewcommand\@ptsize{1}}
\DeclareOptionX{12pt}{\renewcommand\@ptsize{2}}
\if@compatibility\else
\DeclareOptionX{oneside}{\@twosidefalse \@mparswitchfalse}
\fi
\DeclareOptionX{twoside}{\@twosidetrue  \@mparswitchtrue}
\DeclareOptionX{draft}{\setlength\overfullrule{5pt}}
\if@compatibility\else
\DeclareOptionX{final}{\setlength\overfullrule{0pt}}
\fi
\DeclareOptionX{titlepage}{\@titlepagetrue}
\if@compatibility\else
\DeclareOptionX{notitlepage}{\@titlepagefalse}
\fi
\if@compatibility\else
\DeclareOptionX{onecolumn}{\@twocolumnfalse}
\fi
\DeclareOptionX{twocolumn}{\@twocolumntrue}
\DeclareOptionX{leqno}{\input{leqno.clo}}
\DeclareOptionX{fleqn}{\input{fleqn.clo}}
\DeclareOptionX{openbib}{%
  \AtEndOfPackage{%
   \renewcommand\@openbib@code{%
      \advance\leftmargin\bibindent
      \itemindent -\bibindent
      \listparindent \itemindent
      \parsep \z@
      }%
   \renewcommand\newblock{\par}}%
}
%declare some dummy options for compatibility
\DeclareOptionX{checkin}{}
\DeclareOptionX{preprint}{}
\DeclareOptionX{reprint}{}
\DeclareOptionX{manuscript}{}
\DeclareOptionX{noshowpacs}{}
\DeclareOptionX{showpacs}{}
\DeclareOptionX{showkeys}{}
\DeclareOptionX{noshowkeys}{}
\DeclareOptionX{balancelastpage}{}
\DeclareOptionX{nobalancelastpage}{}
\DeclareOptionX{nopreprintnumbers}{}
\DeclareOptionX{preprintnumbers}{}
\DeclareOptionX{hyperref}{}
\DeclareOptionX{bibnotes}{}
\DeclareOptionX{nobibnotes}{}
\DeclareOptionX{footinbib}{}
\DeclareOptionX{nofootinbib}{}
\DeclareOptionX{altaffilletter}{}
\DeclareOptionX{altaffilsymbol}{}
\DeclareOptionX{superbib}{}
\DeclareOptionX{citeautoscript}{}
\DeclareOptionX{longbibliography}{}
\DeclareOptionX{nolongbibliography}{}
\DeclareOptionX{eprint}{}
\DeclareOptionX{noeprint}{}
\DeclareOptionX{author-year}{}
\DeclareOptionX{numerical}{}
\DeclareOptionX{galley}{}
\DeclareOptionX{raggedbottom}{}
\DeclareOptionX{tightenlines}{}
\DeclareOptionX{lengthcheck}{}
\DeclareOptionX{reprint}{}
\DeclareOptionX{eqsecnum}{}
\DeclareOptionX{secnumarabic}{}
\DeclareOptionX{fleqn}{}
\DeclareOptionX{floats}{}
\DeclareOptionX{stfloats}{}
\DeclareOptionX{endfloats}{}
\DeclareOptionX{endfloats*}{}
\DeclareOptionX{osa}{}
\DeclareOptionX{osameet}{}
\DeclareOptionX{opex}{}
\DeclareOptionX{tops}{}
\DeclareOptionX{josa}{}
\newif\ifamsfonts
\amsfontsfalse
\DeclareOptionX{amsfonts}{\amsfontstrue}%
\DeclareOptionX{noamsfonts}{}
\newif\ifamssymb
\amssymbfalse
\DeclareOptionX{amssymb}{\amssymbtrue}%
\DeclareOptionX{amssymbol}{\amssymbtrue}%
\DeclareOptionX{noamssymb}{}
\newif\ifamsmath
\amsmathfalse
\DeclareOptionX{amsmath}{\amsmathtrue}%
\DeclareOptionX{noamsmath}{}
\DeclareOptionX{byrevtex}{}
\DeclareOptionX{floatfix}{}
\DeclareOptionX{nofloatfix}{}
\DeclareOptionX{ltxgridinfo}{}
\DeclareOptionX{outputdebug}{}
\DeclareOptionX{raggedfooter}{}
\DeclareOptionX{noraggedfooter}{}
\DeclareOptionX{frontmatterverbose}{}
\DeclareOptionX{linenumbers}{}
\DeclareOptionX{nomerge}{}
\DeclareOptionX{hypertext}{}
\DeclareOptionX{frontmatterverbose}{}
\DeclareOptionX{inactive}{}
\DeclareOptionX{groupedaddress}{}
\DeclareOptionX{unsortedaddress}{}
\DeclareOptionX{runinaddress}{}
\DeclareOptionX{superscriptaddress}{}
\newif\ifunpublished\unpublishedfalse
\DeclareOptionX{unpublished}{\unpublishedtrue}
\newif\ifaccepted\acceptedfalse
\DeclareOptionX{accepted}[]{\ifstrempty{#1}{}{\def\@accepteddate{#1}}\acceptedtrue\unpublishedfalse}
\newif\ifrevtexcompatibility
\revtexcompatibilityfalse
\DeclareOptionX{aps}{\revtexcompatibilitytrue}
\DeclareOptionX{pra}{\revtexcompatibilitytrue}
\DeclareOptionX{prb}{\revtexcompatibilitytrue}
\DeclareOptionX{pre}{\revtexcompatibilitytrue}
\DeclareOptionX{prl}{\revtexcompatibilitytrue}
\DeclareOptionX{prx}{\revtexcompatibilitytrue}
\DeclareOptionX{aip}{\revtexcompatibilitytrue}
\newif\ifallowfontchageintitle
\allowfontchageintitlefalse
\DeclareOptionX{allowfontchageintitle}{\allowfontchageintitletrue}
\newif\ifnopdfoutputerror
\nopdfoutputerrortrue
\DeclareOptionX{nopdfoutputerror}{\nopdfoutputerrorfalse}%

\ExecuteOptionsX{a4paper,10pt,oneside,twocolumn,notitlepage,final}
\ProcessOptionsX

\input{size1\@ptsize.clo}

%enable the blacklisting of packages by patching the \usepackage command
\csdef{@packageblacklist}{}
\newcommand{\@blacklistpackage}[2][]{
  \listxadd{\@packageblacklist}{#2}%
  \ifstrempty{#1}{}{\csdef{@packageblacklisterrormessage#2}{#1 \string\usepackage{#2}}}
}
\let\oldusepackage\usepackage
\renewcommand{\usepackage}[2][]{
  \ifinlist{#2}{\@packageblacklist}{
    \ifcsdef{@packageblacklisterrormessage#2}{
      \ClassError{quantumarticle}{\csname @packageblacklisterrormessage#2\endcsname}{}}{}
    }{\oldusepackage[#1]{#2}}
}
\@blacklistpackage{titlesec}

\if@twocolumn
\RequirePackage[margin=2cm,bottom=3cm]{geometry}
\else
\RequirePackage[margin=3cm,bottom=3cm]{geometry}
\fi
\@blacklistpackage{geometry}
\setlength\lineskip{1\p@}
\setlength\normallineskip{1\p@}
\renewcommand\baselinestretch{}
\setlength\parskip{0\p@ \@plus \p@}
\@lowpenalty   51
\@medpenalty  151
\@highpenalty 301

\AtBeginDocument{
  % avoid bitmap fonts by loading lmodern or at least checking for cm-super
  \IfFileExists{lmodern.sty}{
    \RequirePackage{lmodern}
  }{
    \IfFileExists{type1ec.sty}{}{
      \PackageError{quantumarticle}{Either the lmodern or the cm-super package are required by quantumarticle in order to produce high quality pdf output.}{Please install the lmodern package, or, if this is not possible, the cm-super package.}
    }
  }
  % Define a revtex-style openone symbol
  \IfFileExists{bbm.sty}{
    \RequirePackage{bbm}
    \DeclareRobustCommand\openone{\mathbbm{1}}
  }{
    \IfFileExists{dsfont.sty}{
      \RequirePackage{dsfont}
      \DeclareRobustCommand\openone{\mathds{1}}
    }{
      % This uses a similar technique to {revtex4-1}'s openone,
      % namely two overstruck numeral 1s, but implemented using mboxes
      % and math kerning as suggested by The Comprehensive LaTeX Symbol List.
      \DeclareRobustCommand\openone{{\mbox{\small1}\mkern-5.5mu1}}
    }
  }
  \RequirePackage{xcolor}
  \definecolor{quantumviolet}{HTML}{53257F} %Quantum violet
  \definecolor{quantumgray}{HTML}{555555} %Quantum gray
}

\RequirePackage{ltxcmds}

\let\origif@twocolumn\if@twocolumn
\def\class@name{ltxutil}%get rid of "You should define the class name before reading in this package. Using default" warning from ltxutils which is loaded by ltxgrid
\if@twocolumn
\RequirePackage{ltxgrid}%ltxgrid should be loaded before etoolbox, otherwise terrible things can happen: http://tex.stackexchange.com/questions/343856/biblatex-produces-incomplete-bcf-with-biber-backend?noredirect=1#comment843815_343856 but if this is actually done, even more terrible things happen, so we partially repair what ltxgrid messes up below...
\newcommand{\twocolumn}[1][]{#1\twocolumngrid}
\newcommand{\onecolumn}{\onecolumngrid}
\fi
\let\if@twocolumn\origif@twocolumn

\let\col@number\@colnum

\ltx@ifpackageloaded{ltxgrid}{}{
%repair what ltxutils has destroyed (see http://tex.stackexchange.com/questions/343856/biblatex-produces-incomplete-bcf-with-biber-backend) 
\patchcmd\enddocument
  {\deadcycles}
  {\let\AfterEndDocument\@firstofone    
   \@afterenddocumenthook
   \deadcycles}
  {}
  {\AtEndDocument{%
     \let\etb@@end\@@end
     \def\@@end{%
       \let\AfterEndDocument\@firstofone
       \@afterenddocumenthook
       \etb@@end}}}
}
 
\setcounter{topnumber}{2}
\renewcommand\topfraction{.7}
\setcounter{bottomnumber}{1}
\renewcommand\bottomfraction{.3}
\setcounter{totalnumber}{3}
\renewcommand\textfraction{.2}
\renewcommand\floatpagefraction{.5}
\setcounter{dbltopnumber}{2}
\renewcommand\dbltopfraction{.7}
\renewcommand\dblfloatpagefraction{.5}
\if@twoside
  \def\ps@headings{%
      \let\@oddfoot\@empty\let\@evenfoot\@empty
      \def\@evenhead{\thepage\hfil\slshape\leftmark}%
      \def\@oddhead{{\slshape\rightmark}\hfil\thepage}%
      \let\@mkboth\markboth
    \def\sectionmark##1{%
      \markboth {\MakeUppercase{%
        \ifnum \c@secnumdepth >\z@
          \thesection\quad
        \fi
        ##1}}{}}%
    \def\subsectionmark##1{%
      \markright {%
        \ifnum \c@secnumdepth >\@ne
          \thesubsection\quad
        \fi
        ##1}}}
\else
  \def\ps@headings{%
    \let\@oddfoot\@empty
    \def\@oddhead{{\slshape\rightmark}\hfil\thepage}%
    \let\@mkboth\markboth
    \def\sectionmark##1{%
      \markright {\MakeUppercase{%
        \ifnum \c@secnumdepth >\m@ne
          \thesection\quad
        \fi
        ##1}}}}
\fi
\def\ps@myheadings{%
    \let\@oddfoot\@empty\let\@evenfoot\@empty
    \def\@evenhead{\thepage\hfil\slshape\leftmark}%
    \def\@oddhead{{\slshape\rightmark}\hfil\thepage}%
    \let\@mkboth\@gobbletwo
    \let\sectionmark\@gobble
    \let\subsectionmark\@gobble
    }
  \if@titlepage
  \newcommand\maketitle{\begin{titlepage}%
%  \let\footnotesize\small
  \let\footnoterule\relax
  \let \footnote \thanks
  \null\vfil
  \vskip 60\p@
  \begin{center}%
    \@maketitle
  \end{center}\par
%  \@thanks
  \vfil\null
  \end{titlepage}%
  \setcounter{footnote}{0}%
  \global\let\thanks\relax
  \global\let\maketitle\relax
  \global\let\@maketitle\relax
%  \global\let\@thanks\@empty
%  \global\let\@author\@empty
%  \global\let\@date\@empty
%  \global\let\@title\@empty
  \global\let\title\relax
  \global\let\author\relax
  \global\let\date\relax
  \global\let\and\relax
}
\else
\newcommand\maketitle{\par
  \begingroup
    \renewcommand\thefootnote{\@fnsymbol\c@footnote}%
    \def\@makefnmark{\rlap{\@textsuperscript{\normalfont\@thefnmark}}}%
    \long\def\@makefntext##1{\parindent 1em\noindent
            \hb@xt@1.8em{%
                \hss\@textsuperscript{\normalfont\@thefnmark}}##1}%
    \if@twocolumn
      \ifnum \col@number=\@ne
        \@maketitle
      \else
        \twocolumn[\@maketitle]%
      \fi
    \else
      \global\@topnum\z@   % Prevents figures from going at top of page.
      \@maketitle
    \fi
    \thispagestyle{fancy}%\@thanks
  \endgroup
  \setcounter{footnote}{0}%
  \global\let\thanks\relax
  \global\let\maketitle\relax
  \global\let\@maketitle\relax
%  \global\let\@thanks\@empty
%  \global\let\@author\@empty
%  \global\let\@date\@empty
%  \global\let\@title\@empty
  \global\let\title\relax
  \global\let\author\relax
  \global\let\date\relax
  \global\let\and\relax
}
\fi
\def\@maketitle{%
  \sffamily
  \null
  \let \footnote \thanks
    \noindent\@printtitle
    \vskip 1.5em%
    \noindent\@printauthors
    \vskip 1em%
    \noindent\@printaffiliations
    \vskip 0em%
    \noindent{\footnotesize\color{quantumgray}\@date}
  \par
  \vskip 1.5em
  \makeatletter%
  \begingroup
  \hypersetup{%
    pdftitle={\detokenize\expandafter{\@title}},
    pdfauthor={\@authorsonly},
    pdfkeywords={\@keywords},
    pdfcreator={LaTeX with hyperref package and class quantumarticle \csname ver@quantumarticle.cls\endcsname},
  }%
  \endgroup
  \makeatother%
}
\setcounter{secnumdepth}{3}
\newcounter {part}
\newcounter {section}
\newcounter {subsection}[section]
\newcounter {subsubsection}[subsection]
\newcounter {paragraph}[subsubsection]
\newcounter {subparagraph}[paragraph]
\renewcommand \thepart {\@Roman\c@part}
\renewcommand \thesection {\@arabic\c@section}
\renewcommand\thesubsection   {\thesection.\@arabic\c@subsection}
\renewcommand\thesubsubsection{\thesubsection.\@arabic\c@subsubsection}
\renewcommand\theparagraph    {\thesubsubsection.\@arabic\c@paragraph}
\renewcommand\thesubparagraph {\theparagraph.\@arabic\c@subparagraph}
\newcommand\part{%
   \if@noskipsec \leavevmode \fi
   \par
   \addvspace{4ex}%
   \@afterindentfalse
   \secdef\@part\@spart}

\def\@part[#1]#2{%
    \ifnum \c@secnumdepth >\m@ne
      \refstepcounter{part}%
      \addcontentsline{toc}{part}{\thepart\hspace{1em}#1}%
    \else
      \addcontentsline{toc}{part}{#1}%
    \fi
    {\parindent \z@ \raggedright
     \interlinepenalty \@M
     \normalfont
     \ifnum \c@secnumdepth >\m@ne
       \Large\bfseries \partname\nobreakspace\thepart
       \par\nobreak
     \fi
     \huge \bfseries #2%
     \markboth{}{}\par}%
    \nobreak
    \vskip 3ex
    \@afterheading}
\def\@spart#1{%
    {\parindent \z@ \raggedright
     \interlinepenalty \@M
     \normalfont
     \huge \bfseries #1\par}%
     \nobreak
     \vskip 3ex
     \@afterheading}
\newcommand\section{\@startsection {section}{1}{\z@}%
                                   {-3.5ex \@plus -1ex \@minus -.2ex}%
                                   {2.3ex \@plus.2ex}%
                                   {\normalfont\Large\sffamily}}
\newcommand\subsection{\@startsection{subsection}{2}{\z@}%
                                     {-3.25ex\@plus -1ex \@minus -.2ex}%
                                     {1.5ex \@plus .2ex}%
                                     {\normalfont\large\sffamily}}
\newcommand\subsubsection{\@startsection{subsubsection}{3}{\z@}%
                                     {-3.25ex\@plus -1ex \@minus -.2ex}%
                                     {1.5ex \@plus .2ex}%
                                     {\normalfont\normalsize\sffamily}}
\newcommand\paragraph{\@startsection{paragraph}{4}{\z@}%
                                    {3.25ex \@plus1ex \@minus.2ex}%
                                    {-1em}%
                                    {\normalfont\normalsize\bfseries}}
\newcommand\subparagraph{\@startsection{subparagraph}{5}{\parindent}%
                                       {3.25ex \@plus1ex \@minus .2ex}%
                                       {-1em}%
                                      {\normalfont\normalsize\bfseries}}
\if@twocolumn
  \setlength\leftmargini  {2em}
\else
  \setlength\leftmargini  {2.5em}
\fi
\leftmargin  \leftmargini
\setlength\leftmarginii  {2.2em}
\setlength\leftmarginiii {1.87em}
\setlength\leftmarginiv  {1.7em}
\if@twocolumn
  \setlength\leftmarginv  {.5em}
  \setlength\leftmarginvi {.5em}
\else
  \setlength\leftmarginv  {1em}
  \setlength\leftmarginvi {1em}
\fi
\setlength  \labelsep  {.5em}
\setlength  \labelwidth{\leftmargini}
\addtolength\labelwidth{-\labelsep}
\@beginparpenalty -\@lowpenalty
\@endparpenalty   -\@lowpenalty
\@itempenalty     -\@lowpenalty
\renewcommand\theenumi{\@arabic\c@enumi}
\renewcommand\theenumii{\@alph\c@enumii}
\renewcommand\theenumiii{\@roman\c@enumiii}
\renewcommand\theenumiv{\@Alph\c@enumiv}
\newcommand\labelenumi{\theenumi.}
\newcommand\labelenumii{(\theenumii)}
\newcommand\labelenumiii{\theenumiii.}
\newcommand\labelenumiv{\theenumiv.}
\renewcommand\p@enumii{\theenumi}
\renewcommand\p@enumiii{\theenumi(\theenumii)}
\renewcommand\p@enumiv{\p@enumiii\theenumiii}
\newcommand\labelitemi{\textbullet}
\newcommand\labelitemii{\normalfont\bfseries \textendash}
\newcommand\labelitemiii{\textasteriskcentered}
\newcommand\labelitemiv{\textperiodcentered}
\newenvironment{description}
               {\list{}{\labelwidth\z@ \itemindent-\leftmargin
                        \let\makelabel\descriptionlabel}}
               {\endlist}
\newcommand*\descriptionlabel[1]{\hspace\labelsep
                                \normalfont\bfseries #1}
\if@titlepage
  \newenvironment{abstract}{%
    \ifx\maketitle\relax{}\else\maketitle\fi
      \titlepage
      \null\vfil
      \thispagestyle{empty}%
      \@beginparpenalty\@lowpenalty
      \begin{center}%
        \bfseries \abstractname
        \@endparpenalty\@M
      \end{center}}%
     {\par\vfil\null\newpage\endtitlepage}
\else
  \newenvironment{abstract}{%
    \ifx\maketitle\relax{}\else\maketitle\fi
      \if@twocolumn
      \bf
      \else
        \vskip 1em \quotation
      \fi}
      {\if@twocolumn\else\endquotation\vskip 2em\fi}
\fi
\newenvironment{verse}
               {\let\\\@centercr
                \list{}{\itemsep      \z@
                        \itemindent   -1.5em%
                        \listparindent\itemindent
                        \rightmargin  \leftmargin
                        \advance\leftmargin 1.5em}%
                \item\relax}
               {\endlist}
\newenvironment{quotation}
               {\list{}{\listparindent 1.5em%
                        \itemindent    \listparindent
                        \rightmargin   \leftmargin
                        \parsep        \z@ \@plus\p@}%
                \item\relax}
               {\endlist}
\newenvironment{quote}
               {\list{}{\rightmargin\leftmargin}%
                \item\relax}
               {\endlist}
\if@compatibility
\newenvironment{titlepage}
    {%
      \if@twocolumn
        \@restonecoltrue\onecolumn
      \else
        \@restonecolfalse\newpage
      \fi
      \thispagestyle{empty}%
      \setcounter{page}\z@
    }%
    {\if@restonecol\twocolumn \else \newpage \fi
    }
\else
\newenvironment{titlepage}
    {%
      \if@twocolumn
        \@restonecoltrue\onecolumn\newpage
      \else
        \@restonecolfalse\newpage
      \fi
      \thispagestyle{empty}%
      \setcounter{page}\@ne
    }%
    {\if@restonecol\twocolumn \else \newpage \fi
     \if@twoside\else
        \setcounter{page}\@ne
     \fi
    }
\fi
\newcommand\appendix{\par
  \setcounter{section}{0}%
  \setcounter{subsection}{0}%
  \gdef\thesection{\@Alph\c@section}}
\setlength\arraycolsep{5\p@}
\setlength\tabcolsep{6\p@}
\setlength\arrayrulewidth{.4\p@}
\setlength\doublerulesep{2\p@}
\setlength\tabbingsep{\labelsep}
\skip\@mpfootins = \skip\footins
\setlength\fboxsep{3\p@}
\setlength\fboxrule{.4\p@}
\renewcommand \theequation {\@arabic\c@equation}
\newcounter{figure}
\renewcommand \thefigure {\@arabic\c@figure}
\def\fps@figure{tbp}
\def\ftype@figure{1}
\def\ext@figure{lof}
\def\fnum@figure{\figurename\nobreakspace\thefigure}
\newenvironment{figure}
               {\@float{figure}}
               {\end@float}
\newenvironment{figure*}
               {\@dblfloat{figure}}
               {\end@dblfloat}
\newcounter{table}
\renewcommand\thetable{\@arabic\c@table}
\def\fps@table{tbp}
\def\ftype@table{2}
\def\ext@table{lot}
\def\fnum@table{\tablename\nobreakspace\thetable}
\newenvironment{table}
               {\@float{table}}
               {\end@float}
\newenvironment{table*}
               {\@dblfloat{table}}
               {\end@dblfloat}
\newlength\abovecaptionskip
\newlength\belowcaptionskip
\setlength\abovecaptionskip{10\p@}
\setlength\belowcaptionskip{0\p@}
\long\def\@makecaption#1#2{%
  \vskip\abovecaptionskip
  \sbox\@tempboxa{#1: #2}%
  \ifdim \wd\@tempboxa >\hsize
    #1: #2\par
  \else
    \global \@minipagefalse
    \hb@xt@\hsize{\hfil\box\@tempboxa\hfil}%
  \fi
  \vskip\belowcaptionskip}
\DeclareOldFontCommand{\rm}{\normalfont\rmfamily}{\mathrm}
\DeclareOldFontCommand{\sf}{\normalfont\sffamily}{\mathsf}
\DeclareOldFontCommand{\tt}{\normalfont\ttfamily}{\mathtt}
\DeclareOldFontCommand{\bf}{\normalfont\bfseries}{\mathbf}
\DeclareOldFontCommand{\it}{\normalfont\itshape}{\mathit}
\DeclareOldFontCommand{\sl}{\normalfont\slshape}{\@nomath\sl}
\DeclareOldFontCommand{\sc}{\normalfont\scshape}{\@nomath\sc}
\DeclareRobustCommand*\cal{\@fontswitch\relax\mathcal}
\DeclareRobustCommand*\mit{\@fontswitch\relax\mathnormal}
\newcommand\@pnumwidth{1.55em}
\newcommand\@tocrmarg{2.55em}
\newcommand\@dotsep{4.5}
\setcounter{tocdepth}{3}
% We use a trick from Ivan Andrus (http://stackoverflow.com/a/2785740)
% to hide the "\section*{Contents}" command from the table of contents
% to avoid getting an ugly duplication of the Contents header inside
% the table itself.
%
% This trick consists of temporarily redefining \addcontentsline to
% do nothing during the expansion of the arguments to \tocless.
\newcommand{\nocontentsline}[3]{}
\newcommand{\tocless}[2]{\bgroup\let\addcontentsline=\nocontentsline#1{#2}\egroup}
\newcommand\tableofcontents{%
    \tocless{\section*}{\contentsname
        \@mkboth{%
           \MakeUppercase\contentsname}{\MakeUppercase\contentsname}}%
    \@starttoc{toc}%
    }
\newcommand*\l@part[2]{%
  \ifnum \c@tocdepth >-2\relax
    \addpenalty\@secpenalty
    \addvspace{2.25em \@plus\p@}%
    \setlength\@tempdima{3em}%
    \begingroup
      \parindent \z@ \rightskip \@pnumwidth
      \parfillskip -\@pnumwidth
      {\leavevmode
       \large \bfseries #1\hfil \hb@xt@\@pnumwidth{\hss #2}}\par
       \nobreak
       \if@compatibility
         \global\@nobreaktrue
         \everypar{\global\@nobreakfalse\everypar{}}%
      \fi
    \endgroup
  \fi}
\newcommand*\l@section[2]{%
  \ifnum \c@tocdepth >\z@
    \addpenalty\@secpenalty
    \addvspace{1.0em \@plus\p@}%
    \setlength\@tempdima{1.5em}%
    \begingroup
      \parindent \z@ \rightskip \@pnumwidth
      \parfillskip -\@pnumwidth
      \leavevmode \bfseries
      \advance\leftskip\@tempdima
      \hskip -\leftskip
      #1\nobreak\hfil \nobreak\hb@xt@\@pnumwidth{\hss #2}\par
    \endgroup
  \fi}
\newcommand*\l@subsection{\@dottedtocline{2}{1.5em}{2.3em}}
\newcommand*\l@subsubsection{\@dottedtocline{3}{3.8em}{3.2em}}
\newcommand*\l@paragraph{\@dottedtocline{4}{7.0em}{4.1em}}
\newcommand*\l@subparagraph{\@dottedtocline{5}{10em}{5em}}
\newcommand\listoffigures{%
    \section*{\listfigurename}%
      \@mkboth{\MakeUppercase\listfigurename}%
              {\MakeUppercase\listfigurename}%
    \@starttoc{lof}%
    }
\newcommand*\l@figure{\@dottedtocline{1}{1.5em}{2.3em}}
\newcommand\listoftables{%
    \section*{\listtablename}%
      \@mkboth{%
          \MakeUppercase\listtablename}%
         {\MakeUppercase\listtablename}%
    \@starttoc{lot}%
    }
\let\l@table\l@figure
% Declare a new \acknowledgements command for {revtex4-1}
% compatability.
\newcommand{\acknowledgmentsname}{Acknowledgments}
\newcommand{\acknowledgments}[1]{%
    \section*{\acknowledgmentsname}%
    #1%
}

\newdimen\bibindent
\setlength\bibindent{1.5em}
\newenvironment{thebibliography}[1]
{%
  \makeatletter%
  \ltx@ifpackageloaded{natbib}{}{%
    \ltx@ifpackageloaded{biblatex}{
      \ClassWarning{quantumarticle}{Unfortunately the quantumarticle can not recommend the use of biblatex due to incompatibilities between locally installed versions of biblatex and the version used by the arXiv.}%
    }{%
      \ClassWarning{quantumarticle}{The quantumarticle class recommends generating the bibliography from a BibTeX file containing DOIs with natbib in order to ensure the generation of DOI hyperlinks}%
    }%
  }%
  \makeatother%
  \section*{\refname}%
  \@mkboth{\MakeUppercase\refname}{\MakeUppercase\refname}%
  \list{\@biblabel{\@arabic\c@enumiv}}%
  {\settowidth\labelwidth{\@biblabel{#1}}%
    \leftmargin\labelwidth
    \advance\leftmargin\labelsep
    \@openbib@code
    \usecounter{enumiv}%
    \let\p@enumiv\@empty
    \renewcommand\theenumiv{\@arabic\c@enumiv}}%
  \sloppy
  \clubpenalty4000
  \@clubpenalty \clubpenalty
  \widowpenalty4000%
  \sfcode`\.\@m
  \setlength{\itemsep}{0pt plus 0.3ex}
}
{\def\@noitemerr
  {\@latex@warning{Empty `thebibliography' environment}}%
  \endlist}
\newcommand\newblock{\hskip .11em\@plus.33em\@minus.07em}
\let\@openbib@code\@empty
\newenvironment{theindex}
  {\if@twocolumn
    \@restonecolfalse
    \else
    \@restonecoltrue
    \fi
    \twocolumn[\section*{\indexname}]%
    \@mkboth{\MakeUppercase\indexname}%
    {\MakeUppercase\indexname}%
    \thispagestyle{fancy}\parindent\z@
    \parskip\z@ \@plus .3\p@\relax
    \columnseprule \z@
    \columnsep 35\p@
    \let\item\@idxitem}
  {\if@restonecol\onecolumn\else\clearpage\fi}
\newcommand\@idxitem{\par\hangindent 40\p@}
\newcommand\subitem{\@idxitem \hspace*{20\p@}}
\newcommand\subsubitem{\@idxitem \hspace*{30\p@}}
\newcommand\indexspace{\par \vskip 10\p@ \@plus5\p@ \@minus3\p@\relax}
\renewcommand\footnoterule{%
  \kern-3\p@
  \hrule\@width.4\columnwidth
  \kern2.6\p@}
\newcommand\@makefntext[1]{%
    \parindent 1em%
    \noindent
    \hb@xt@1.8em{\hss\@makefnmark}#1}
\newcommand\contentsname{Contents}
\newcommand\listfigurename{List of Figures}
\newcommand\listtablename{List of Tables}
\newcommand\refname{References}
\newcommand\indexname{Index}
\newcommand\figurename{Figure}
\newcommand\tablename{Table}
\newcommand\partname{Part}
\newcommand\appendixname{Appendix}
\newcommand\abstractname{Abstract}
\def\today{\ifcase\month\or
  January\or February\or March\or April\or May\or June\or
  July\or August\or September\or October\or November\or December\fi
  \space\number\day, \number\year}
\setlength\columnsep{20\p@}
\setlength\columnseprule{0\p@}
\setlength{\footnotesep}{\baselineskip}
\RequirePackage{fancyhdr}
\@blacklistpackage{fancyhdr}
\pagestyle{fancy}
\renewcommand{\headrule}{}
\renewcommand{\footrule}{\vbox to 0pt{\hbox to\headwidth{\color{quantumgray}\leaders\hrule\hfil}\vss}}
\fancyhf{}
\ifaccepted
\fancyfoot[R]{\sffamily\ifunpublished{\thepage}\else\textcolor{quantumviolet}{\thepage}\fi}
\else
\fancyfoot[C]{\sffamily\ifunpublished{\thepage}\else\textcolor{quantumviolet}{\thepage}\fi}
\fi

% validate the date format to be YYYY-MM-DD
\AtBeginDocument{
  \ifcsdef{@accepteddate}{%
    \if@xstring%
    \RequirePackage{xstring}
    \def\@dateerror{\ClassError{quantumarticle}{The date in the accepted option must be given in the format YYYY-MM-DD}{}}
    % test that we have two -s
    \IfSubStr[2]{\@accepteddate}{-}{}{\@dateerror}
    \IfSubStr[3]{\@accepteddate}{-}{\@dateerror}{}
    \StrBefore[1]{\@accepteddate}{-}[\@accepteddateyear]
    \StrBetween[1,2]{\@accepteddate}{-}{-}[\@accepteddatemonth]
    \StrBehind[2]{\@accepteddate}{-}[\@accepteddateday]
    \IfDecimal{\@accepteddateyear}{}{\@dateerror}
    \IfDecimal{\@accepteddatemonth}{}{\@dateerror}
    \IfDecimal{\@accepteddateday}{}{\@dateerror}
    \StrLen{\@accepteddateyear}[\@accepteddateyearlength]
    \StrLen{\@accepteddatemonth}[\@accepteddatemonthlength]
    \StrLen{\@accepteddateday}[\@accepteddatedaylength]
    \ifnumcomp{\@accepteddateyearlength}{>}{3}{}{\@dateerror}
    \ifnumcomp{\@accepteddatemonthlength}{=}{2}{}{\@dateerror}
    \ifnumcomp{\@accepteddatedaylength}{=}{2}{}{\@dateerror}
    \fi%
  }{}
}
\ifaccepted
\fancyfoot[L]{\usebox{\@quantumacceptedbox}}
\else
\fancyfoot[L]{}
\fi
\pagenumbering{arabic}
\if@twoside
\else
  \raggedbottom
\fi
\if@twocolumn
  \twocolumn
  \sloppy
  \flushbottom
\else
  \onecolumn
\fi

%the following is mostly taken from revtex4-1 (see https://www.ctan.org/pkg/revtex4-1)
\if@twocolumn
\newbox\widetext@top
\newbox\widetext@bot
\newenvironment{widetext}{%
  \par\ignorespaces
  \setbox\widetext@top\vbox{%
   \hb@xt@\hsize{%
     {\color{quantumgray}%
    \leaders\hrule\hfil
    \vrule\@height6\p@}
   }%
  }%
  \setbox\widetext@bot\hb@xt@\hsize{%
    {\color{quantumgray}%
    \vrule\@depth6\p@
    \leaders\hrule\hfil}
  }%
  \onecolumngrid
  \vskip10\p@
  \dimen@\ht\widetext@top\advance\dimen@\dp\widetext@top
  \cleaders\box\widetext@top\vskip\dimen@
  \vskip6\p@
  \prep@math@patch
}{%
  \par
  \vskip6\p@
  \setbox\widetext@bot\vbox{%
   \hb@xt@\hsize{\hfil\box\widetext@bot}%
  }%
  \dimen@\ht\widetext@bot\advance\dimen@\dp\widetext@bot
  \cleaders\box\widetext@bot\vskip\dimen@
  \vskip8.5\p@
  \twocolumngrid\global\@ignoretrue
  \@endpetrue
}%
\else
\newenvironment{widetext}{}{}
\fi


%title
\def\@printtitle{%
  {%
    \ifunpublished%
    \begin{minipage}{1.0\linewidth}%
      \@printtitletextwithappropriatefontsize%
    \end{minipage}
    \else%
    \edef\@titleexpanded{\detokenize\expandafter{\@title}}%
    \if@xstring\saveexploremode\exploregroups\StrSubstitute{\@titleexpanded}{ }{\%20}[\@titleforurl]\restoreexploremode\else\gdef\@titleforurl{\@titleexpanded}\fi%
    \href{http://quantum-journal.org/?s=\@titleforurl\&reason=title-click}{%
      \begin{minipage}{1.0\linewidth}%
        \color{quantumviolet}{%
          \@printtitletextwithappropriatefontsize%
        }%
      \end{minipage}}%
    \fi%
  }%
}
% In the macro below we compute the appropriate font size of the title.
% We use \Huge if the title fits on one line and \huge if it extends over more
% than one line in font size \Huge
\def\@titleatfontsize#1{%
  \begingroup%
  #1%
  \raggedright%
  \ifallowfontchageintitle\else\def\selectfont{\ClassError{quantumarticle}{You are not allowed to use \string\textbf{}, \string\bf, \string\textit{} or other font formating commands inside \string\title{} Please remove all such commands from your \string\title{}. If you really really have to change the font for some part of the title you can allow this by giving the option allowfontchageintitle}{}}\fi%solution from http://tex.stackexchange.com/questions/347596/disallowing-textbf-it-sffamily-in-argument-of-macro-or-environment
  \@title%
  \endgroup%
}%
\def\@printtitletextwithappropriatefontsize{%
  \newsavebox{\@titelsaveboxHuge}%
  \savebox{\@titelsaveboxHuge}{%
    \parbox[b]{\linewidth}{%
      \@titleatfontsize{\Huge}%
    }%
  }%
  \newsavebox{\@titelsaveboxHugeoneline}%
  \savebox{\@titelsaveboxHugeoneline}{%
    \@titleatfontsize{\Huge}%
  }%
  \newsavebox{\@titelsaveboxhhuge}%
  \savebox{\@titelsaveboxhhuge}{%
    \parbox[b]{\linewidth}{%
      \@titleatfontsize{\huge}%
    }%
  }%
  \ifdim\ht\@titelsaveboxHuge>\ht\@titelsaveboxHugeoneline%
  \usebox{\@titelsaveboxhhuge}% using huge because \the\ht\@titelsaveboxHuge{} is larger than \the\ht\@titelsaveboxHugeoneline{}
  \else%
  \usebox{\@titelsaveboxHuge}% using Huge because \the\ht\@titelsaveboxHuge{} is not larger than \the\ht\@titelsaveboxHugeoneline{}
  \fi%
}

%renew \title to allow for and ignore an optional argument
\renewcommand{\title}[2][]{\gdef\@title{#2}}
% author handling
\newcounter{@authorcounter}
\csdef{@authors}{}
\renewcommand{\author}[2][]{%
 \ifstrempty{#1}{%
   \internal@author{#2}%
 }{%
   \internal@elseauthor{#1}{#2}
 }%
 \csdef{@authorname\the@authorcounter}{#2}%
 \def\@currentauthornumber{\the@authorcounter}%
}%
\def\addauthortolabel#1#2{%
  \ifcsdef{authorswithlabel#2}{}{\csdef{authorswithlabel#2}{}}%
  \listcsxadd{authorswithlabel#2}{#1}}%
\def\internal@elseauthor#1#2{%
  \stepcounter{@authorcounter}
  \ifcsdef{@authors}{}{\csdef{@authors}{}}%
  \listadd{\@authors}{#2}%
  \forcsvlist{\addauthortolabel{\the@authorcounter}}{#1}%
  \ifbool{@startnewauthorgroup}{\csundef{@authorgroup}}{}%
  \ifcsdef{@authorgroup}{}{\csdef{@authorgroup}{}}%
  \listxadd{\@authorgroup}{\the@authorcounter}%
  \boolfalse{@startnewauthorgroup}%
}%
\def\internal@author#1{%
  \stepcounter{@authorcounter}
  \ifcsdef{@authors}{}{\csdef{@authors}{}}%
  \listadd{\@authors}{#1}%
  \ifbool{@startnewauthorgroup}{\csundef{@authorgroup}}{}
  \ifcsdef{@authorgroup}{}{\csdef{@authorgroup}{}}%
  \listxadd{\@authorgroup}{\the@authorcounter}
  \boolfalse{@startnewauthorgroup}
}
\def\@@spaceafter#1{#1 }
\def\@@@comma{\def\@@@comma{,}}
\def\@@commaspacebefore#1{\@@@comma{}#1}
\def\@printauthor#1#2{\def\footnote{\ClassError{quantumarticle}{You cannot put a \string\footnote{} command inside the argument of \string\author}{}}\ifcsdef{author#1orcid}{\href{https://orcid.org/\csname author#1orcid\endcsname}{\color{black}#2}}{#2}\ifnumcomp{\the@affiliationcounter}{>}{1}{\textsuperscript{\forlistcsloop{\@@commaspacebefore}{author#1affiliations}\unskip}}{}\ifnumcomp{#1}{<}{\the@authorcounter-1}{, }{\ifnumcomp{#1}{=}{\the@authorcounter-1}{\ifnumcomp{#1}{=}{1}{ and }{, and }}{}}}
\def\@printauthors{%
  \newcounter{@authornum}%
  \large\forlistloop{\stepcounter{@authornum}%
    \ifcsdef{author\the@authornum hasextras}{%
    \insert\footins{\footnotesize%
%      \interlinepenalty\interfootnotelinepenalty
%      \splittopskip\footnotesep
%      \splitmaxdepth \dp\strutbox \floatingpenalty \@MM
      \if@titlepage%
       \hsize\dimexpr \linewidth\relax \@parboxrestore%
      \else%
       \if@twocolumn%
        \hsize\dimexpr 0.5\linewidth-0.5\columnsep\relax \@parboxrestore%
       \else%
        \hsize\dimexpr \linewidth\relax \@parboxrestore%
       \fi%
      \fi%
      % \flushleft%
      % \baselineskip=0pt%
      \@printauthorextrainfo{\the@authornum}\vspace{0.5\baselineskip}%
    }}{}%
    \@printauthor\the@authornum}{\@authors}%
}
\def\@@addcommabetween#1{#1, }%this adds an ugly extra comma at the end but the variant below is not expandable and therefore leads to ugly warnings: http://tex.stackexchange.com/questions/50978/macro-to-extract-typeset-plain-text-from-a-command
%\def\@@addcommabetween#1{\ifdef{\firstauthoronly}{, }{\def\firstauthoronly{\empty}}#1}
\def\@authorsonly{\forlistloop{\@@addcommabetween}{\@authors}}
% affiliation handling
\newbool{@startnewauthorgroup}
\newcounter{@affiliationcounter}
\def\@addaffiliation#1#2{
\ifcsdef{author#2affiliations}{}{\csdef{author#2affiliations}{}}%
\listcsgadd{author#2affiliations}{#1}
}
\newcommand{\address}[2][]{\affiliation[#1]{#2}}

%for compatibility with authblk
\@blacklistpackage{authblk} 
\newcommand{\affil}[2][]{
  \affiliation[#1]{#2}}
\newcommand{\affiliation}[2][]{%
 \ifstrempty{#1}{%
   \internal@affiliation{#2}%
 }{%
   \elseinternal@affiliation{#1}{#2}
 }}%
\def\elseinternal@affiliation#1#2{%
  \booltrue{@startnewauthorgroup}
  \ifcsdef{affiliations}{}{\csdef{affiliations}{}}%
  \expandafter\def\csname\detokenize{#2}\endcsname{#2}%
  \stepcounter{@affiliationcounter}%
  \listxadd{\affiliations}{\detokenize{#2}}%
  \csxdef{affiliation\detokenize{#2}number}{\the@affiliationcounter{}}%
  \ifcsdef{authorswithlabel#1}{%
    \forlistcsloop{\@addaffiliation{\csname affiliation\detokenize{#2}number\endcsname}}{authorswithlabel#1}%
  }{}%
}
\def\internal@affiliation#1{%
  \booltrue{@startnewauthorgroup}
  \ifcsdef{affiliations}{}{\csdef{affiliations}{}}%
  \expandafter\def\csname\detokenize{#1}\endcsname{#1} %to handle special characters such as \'a and \l we create a macro whose name is the detokenized version of #1 and that expands to #1 and later call it in \@printaffiliation
  \xifinlist{\detokenize{#1}}{\affiliations}{}{\stepcounter{@affiliationcounter}\listxadd{\affiliations}{\detokenize{#1}}\csxdef{affiliation\detokenize{#1}number}{\the@affiliationcounter{}}}%
  \forlistloop{\@addaffiliation{\csname affiliation\detokenize{#1}number\endcsname}}{\@authorgroup}%
}
\def\@printaffiliation#1#2{\ifnumcomp{\the@affiliationcounter}{>}{1}{\llap{\textsuperscript{#1}}}{}\csname #2\endcsname\ifnumcomp{#1}{<}{\the@affiliationcounter}{\\}{}}
\def\@printaffiliations{%
  \ifcsdef{affiliations}{}{\csdef{affiliations}{}}%
  \newcounter{@affiliationnum}%
  \ifnumcomp{\the@affiliationcounter}{>}{1}{%
    \settowidth{\leftskip}{\footnotesize\textsuperscript{\the@affiliationcounter}}%
  }{}%
  {\footnotesize\color{quantumgray}%
    \forlistloop{\stepcounter{@affiliationnum}\@printaffiliation\the@affiliationnum}{\affiliations}}%
}
%collaboration and altaffiliation
\newcommand{\collaboration}[1]{\author{#1}}
\newcommand{\altaffiliation}[2][]{\affiliation{#1#2}}
%email, homepage, and thanks handling
\def\@printauthorextrainfo#1{%
  \csname @authorname#1\endcsname: \ifcsdef{author#1emails}{\forlistcsloop{\@@spaceafter}{author#1emails}}{}\ifcsdef{author#1homepages}{\ifcsdef{author#1emails}{\unskip, }{}\forlistcsloop{\@@spaceafter}{author#1homepages}}{}\ifcsdef{author#1thanks}{\ifcsdef{author#1emails}{\ifcsdef{author#1homepages}{\unskip, }{\unskip, }}{\ifcsdef{author#1homepages}{\unskip, }{}}\forlistcsloop{\@@spaceafter}{author#1thanks}}{}%
}
\newcommand{\email}[2][]{%
\ifcsdef{@currentauthornumber}{}{\ClassError{quantumarticle}{\string\email{} may only appear after the first \string\author{} command}{}}
\@email{#1}{\href{mailto:#2}{#2}}}
\newcommand{\homepage}[2][]{%
\ifcsdef{@currentauthornumber}{}{\ClassError{quantumarticle}{\string\homepage{} may only appear after the first \string\author{} command}{}}
\@homepage{#1}{\href{#2}{#2}}}
\renewcommand{\thanks}[2][]{%
\ifcsdef{@currentauthornumber}{}{\ClassError{quantumarticle}{\string\thanks{} may only appear after the first \string\author{} command}{}}
\@thanks{#1}{#2}}
\newcommand{\orcid}[2][]{%
\ifcsdef{@currentauthornumber}{}{\ClassError{quantumarticle}{\string\orcid{} may only appear after the first \string\author{} command}{}}
\@orcid{#1}{#2}}
\def\@email#1#2{%}
\@addemail{#1#2}{\@currentauthornumber}
\csdef{author\@currentauthornumber hasextras}{}
}
\def\@homepage#1#2{%
\ifcsdef{@currentauthornumber}{}{\def\@currentauthornumber{0}}%in case \homepage is called before the first author
\@addhomepage{#1#2}{\@currentauthornumber}
\csdef{author\@currentauthornumber hasextras}{}
}
\def\@thanks#1#2{%
\ifcsdef{@currentauthornumber}{}{\def\@currentauthornumber{0}}%in case \thanks is called before the first author
\@addthanks{#1#2}{\@currentauthornumber}
\csdef{author\@currentauthornumber hasextras}{}
}
\def\@orcid#1#2{%
\ifcsdef{@currentauthornumber}{}{\def\@currentauthornumber{0}}%in case \orcid is called before the first author
\@addorcid{#1#2}{\@currentauthornumber}
}
\def\@addemail#1#2{
\ifcsdef{author#2emails}{}{\csdef{author#2emails}{}}%
\listcsgadd{author#2emails}{#1}
}
\def\@addhomepage#1#2{
\ifcsdef{author#2homepages}{}{\csdef{author#2homepages}{}}%
\listcsgadd{author#2homepages}{#1}
}
\def\@addthanks#1#2{
\ifcsdef{author#2thanks}{}{\csdef{author#2thanks}{}}%
\listcsgadd{author#2thanks}{#1}
}
\def\@addorcid#1#2{
\csdef{author#2orcid}{#1}%
}

\newif\if@tikz
\IfFileExists{tikz.sty}{\@tikztrue}{\@tikzfalse}
\newif\if@xstring
\IfFileExists{xstring.sty}{\@xstringtrue}{\@xstringfalse}

\AtBeginDocument{
  \if@xstring
  \RequirePackage{xstring}
  \fi
  \if@tikz
  \RequirePackage{tikz}
  \usetikzlibrary{calc}
  \newlength{\@eQ}%Capital Q height
  \newlength{\@w}%line width
  \newlength{\@rl}%rounding length
  \newlength{\@cw}%character width
  \newlength{\@ch}%lower case character height
  \newlength{\@cr}%corner radius
  \newlength{\@sl}%<> slant
  \newlength{\@xt}%<> x thickeness
  
  \DeclareRobustCommand{\Quantum}{%
    {\sffamily%\color{quantumviolet}%
      \setlength{\@eQ}{\dimexpr\fontcharht\font`Q\relax}%
      \setlength{\@w}{0.088\@eQ}%
      \setlength{\@rl}{0.2\@eQ}%
      \setlength{\@cw}{0.5\@eQ}%
      \setlength{\@ch}{0.65\@eQ}%
      \setlength{\@cr}{0.3\@w}%
      \setlength{\@sl}{0.22\@eQ}%
      \setlength{\@xt}{1.113588507968435\@w}%=math.sqrt(1/(1-pow(22./50.,2)))*\@w
      \tikz[baseline,x=\@eQ,y=\@eQ,every node/.append style={fill=none,inner sep=0pt,outer sep=0pt,node distance=0},rounded corners=\@cr]{%
        % <> leg in back
        % \fill[] (0,0.5) -- ++(\@sl,0.5) -- ++(\@xt,0) -- ++(-\@sl,-0.5) -- ++(\@sl,-0.5) -- ++(-\@xt,0) -- cycle;
        % \fill[xshift=.95\@eQ] (0,0.5) node (eastend) {} -- ++(-\@sl,0.5) -- ++(-\@xt,0) -- ++(\@sl,-0.5) -- ++(-\@sl,-0.5) -- ++(\@xt,0) -- cycle;
        % \begin{scope}
        %   \clip[xshift=.95\@eQ,overlay] (0.5\@xt,0.5) -- ++(-\@sl,-0.5) -- (0,0) -- (0.5\@xt,0.5) ++(-2\@xt,0) -- ++(-\@sl,-0.5) -- ($(-2*\@sl,0)$) -- ++(\@sl,0.5) --cycle;
        %   \fill[xshift=.95\@eQ] (0,0) -- ++(-\@sl,0.5) -- ++(-\@xt,0) -- ++(\@sl,-0.5) -- cycle;    
        % \end{scope}
        \node[overlay,anchor=base west,opacity=0] {Q};
        % <> leg in front
        \fill[] (0,0.5) -- ++(\@sl,0.5) -- ++(\@xt,0) -- ++(-\@sl,-0.5) -- ++(\@sl,-0.5) -- ++(-\@xt,0) -- cycle;
        \begin{scope}[xshift=\@eQ]
          \fill (0,0) -- ++(-\@sl,0.5) -- ++(-\@xt,0) -- ++(\@sl,-0.5) -- cycle;    
          \clip[overlay,rounded corners=0] (-1.34\@xt,0) -- ++(-\@sl,0.5) -- ++(0,-0.5) -- cycle (0.34\@xt,0) -- ++($2*(-\@sl,0.5)$) -- (0.5\@xt,1) --cycle;
          \fill (0,0.5) node (eastend) {} -- ++(-\@sl,0.5) -- ++(-\@xt,0) -- ++(\@sl,-0.5) -- ++(-\@sl,-0.5) -- ++(\@xt,0) -- cycle;
        \end{scope}
        % u
        \def\@u##1{%
          \fill[##1] (0,\@ch) -- (0,1.06\@rl) to[out=-90,in=184,looseness=1.2,overlay] ($(\@cw-\@w,0)$) -- ($(\@cw,0)$) -- ++(0,\@ch) -- ++(-\@w,0) -- ++($(0,-\@ch) + (0,\@w)$) -- ($(\@cw-\@w,\@w)$) to[out=184,in=-90,looseness=1.1] ($(\@w,1.06\@rl)$) -- (\@w,\@ch) --cycle;}
        \@u{shift={($(current bounding box.south east)+(0.172\@eQ,0)$)}}
        \node[overlay,anchor=base east,opacity=0] at (current bounding box.south east) {u};
        % a
        \fill[shift={($(current bounding box.south east)+(0.110\@eQ,0)$)}] (\@cw,0) -- ++($(0,\@ch)-(0,\@rl)$) to[out=90,in=0,looseness=1.22] ++($(-1.22\@rl,\@rl)$) -- ($(\@w,\@ch)$) -- ++(0,-\@w) -- ($(1.22\@rl,\@ch-\@w)$) to[out=0,in=90,looseness=1.3,rounded corners=0] ($(\@cw,\@ch)-(\@w,\@rl)$) -- ($(\@cw,0)-(\@w,-\@w)$) -- 
        ($(\@rl,\@w)$) to[out=180,in=-100,looseness=0.95,rounded corners=0] ($(1.05\@w,0.33\@ch)$) to[out=80,in=176,looseness=1.0] ($(\@cw-\@w,0.47\@ch)$) to[rounded corners=0] ++(0,-\@cr) to[rounded corners=0] ++($(0,\@cr+\@w)$) to[out=176,in=0] ($(1.2\@rl,0.48\@ch)+(0,\@w)$) to[out=180,in=90,rounded corners=0] ($(0.05\@w,0.33\@ch)$) to[out=-90,in=180,looseness=1.1,rounded corners=0] ($(\@rl,0)$) -- cycle;
        \node[overlay,anchor=base east,opacity=0] at (current bounding box.south east) {a};
        % \fill[shift={($(current bounding box.south east)+(0.110\@eQ,0)$)}] (\@cw,0) -- ++($(0,\@ch)-(0,\@rl)$) to[out=90,in=0,looseness=1.22] ++($(-1.22\@rl,\@rl)$) -- ($(\@w,\@ch-0.1\@w)$) -- ++(0.1\@w,-\@w) -- ($(1.22\@rl,\@ch-\@w)$) to[out=0,in=90,looseness=1.3,rounded corners=0] ($(\@cw,\@ch)-(\@w,\@rl)$) -- ($(\@cw,0)-(\@w,-\@w)$) -- 
        % ($(\@rl,\@w)$) to[out=180,in=-100,looseness=0.95,rounded corners=0] ($(1.05\@w,0.33\@ch)$) to[out=80,in=176,looseness=1.0] ($(\@cw-\@w,0.47\@ch)$) to[rounded corners=0] ++(0,-\@cr) to[rounded corners=0] ++($(0,\@cr+\@w)$) to[out=176,in=0] ($(1.2\@rl,0.48\@ch)+(0,\@w)$) to[out=180,in=90,rounded corners=0] ($(0.05\@w,0.33\@ch)$) to[out=-90,in=180,looseness=1.1,rounded corners=0] ($(\@rl,0)$) -- cycle;
        % \node[overlay,anchor=base east,opacity=0] at (current bounding box.south east) {a};
  %n
        \fill[shift={($(current bounding box.south east)+(0.181\@eQ+\@cw,\@ch)$)},rotate=180] (0,\@ch) -- (0,\@rl) to[out=-90,in=180,looseness=1.22] ($(1.2\@rl,0)$) -- (\@cw,0) -- ++(0,\@ch) -- ++(-\@w,0) -- ++($(0,-\@ch) + (0,1.05\@w)$) to[out=182,in=-90,looseness=1.04] ($(\@w,\@rl)$) -- (\@w,\@ch) --cycle;
        \node[overlay,anchor=base east,opacity=0] at (current bounding box.south east) {n};
        % t
        \fill[shift={($(current bounding box.south east)+(0.111\@eQ,0)$)}] 
        (\@w,0.9) [rounded corners=0] -- (\@w,\@ch) [rounded corners=\@cr] -- (0,\@ch) -- ++(0,-\@w) to[rounded corners=0] ++(\@w,0) -- (\@w,\@rl) to[out=-90,in=180,looseness=1.3,overlay] ($(\@w+\@rl,-0.07\@w)$) to[overlay] ++($(0.64\@cw-\@w-\@rl,0)$) -- ++(0,\@w) -- ++($(\@w+\@rl-0.64\@cw,0)$) to[out=180,in=-90,looseness=1.4] ($(2\@w,\@rl)$) -- ++($(0,\@ch-\@rl-\@w)$) -- ($(0.64\@cw,\@ch-\@w)$) -- ++(0,\@w) to[rounded corners=0] (2\@w,\@ch) -- ($(2\@w,0.9)$) --cycle;
        \node[overlay,anchor=base east,opacity=0] at (current bounding box.south east) {t};
        % u
        \@u{shift={($(current bounding box.south east)+(0.125\@eQ,0)$)}}
        % \fill[shift={($(current bounding box.south east)+(0.125\@eQ,0)$)}] (0,\@ch) -- (0,\@rl) to[out=-90,in=180] ($(\@rl,0)$) -- (\@cw,0) -- ++(0,\@ch) -- ++(-\@w,0) -- ++($(0,-\@ch) + (0,\@w)$) -- ($(\@rl,\@w)$) to[out=180,in=-90] ($(\@w,\@rl)$) -- (\@w,\@ch) --cycle;
        \node[overlay,anchor=base east,opacity=0] at (current bounding box.south east) {u};
        % m
        \fill[shift={($(current bounding box.south east)+(0.16\@eQ+1.93*\@cw-\@w,\@ch)$)},rotate=180] (0,\@ch) -- (0,\@rl) to[out=-90,in=180,looseness=1.2] ($(1.2\@rl,0)$) -- ($(1.93\@cw,0)-(\@w,0)$) -- ++(0,\@ch) -- ++(-\@w,0) -- ++($(0,-\@ch) + (0,1.05\@w)$) to[out=184,in=-4] ($(0.97\@cw,1.05\@w)+(0,0)$) -- ++($(0,-1.05\@w)+(0,\@ch)$) -- ++($(-\@w,0)$) -- ++($(0,-\@ch)+(0,1.05\@w)$) to[out=182,in=-90,looseness=1.04] ($(\@w,\@rl)$) -- (\@w,\@ch) --cycle;
        \node[overlay,anchor=base east,opacity=0] at (current bounding box.south east) {m};
      }}}
  \else
  \ClassWarning{quantumarticle}{The tikz package could not be found and the \string\Quantum command will not produce the Quantum logo, but fall back to outputting simply the text Quantum.}
  \DeclareRobustCommand{\Quantum}{Quantum}
  \fi

  \ifaccepted
  \newsavebox\@quantumacceptedbox
  \savebox\@quantumacceptedbox{\textcolor{quantumviolet}{ \sffamily\footnotesize Accepted in {\normalsize\Quantum}\ifcsdef{@accepteddate}{ \@accepteddate}{}, click title to verify}}
  \fi
}
%elsearticle style extra header information
\newcommand{\ead}[2][]{
  \ifstrempty{#1}{
    \email{#2}
  }{
    \if@xstring
    \IfStrEq{#1}{url}{\homepage{#2}}{\email{#2}}
    \else
    \email{#2}
    \fi
  }
}
\AtEndPreamble{
  \providecommand{\@elsearticlecommandsnotsupportederror}{\ClassError{quantumarticle}{The elsearticle style \string\cortext{}, \string\corref{}, \string\fntext{}, \string\fnref{}, \string\tnotetext{}, and \string\tnoteref{} commands are not supported. Please refrain from using title footnotes and use the \string\tahnks{} command for author footnotes instead.}{}}
  \providecommand{\cortext}[2][]{\@elsearticlecommandsnotsupportederror} %corresponding author information
  \providecommand{\corref}[1]{\@elsearticlecommandsnotsupportederror} %corresponding author information reference
  \providecommand{\fntext}[2][]{\@elsearticlecommandsnotsupportederror} %author footnote
  \providecommand{\fnref}[1]{\@elsearticlecommandsnotsupportederror} %author footnot reference
  \providecommand{\tnotetext}[2][]{\@elsearticlecommandsnotsupportederror} %title footnote
  \providecommand{\tnoteref}[1]{\@elsearticlecommandsnotsupportederror} %title footnote reference
}

% set default options for hyperref to make links more pretty
\PassOptionsToPackage{colorlinks=true,hyperindex}{hyperref}
\ifunpublished\else%
\PassOptionsToPackage{allcolors=quantumviolet}{hyperref}
\fi%
\ifnum\pdfoutput=0
\else
\PassOptionsToPackage{breaklinks=true}{hyperref}
\fi

%enable DOIs if biblatex is used by default
\PassOptionsToPackage{doi=true}{biblatex}

\AtBeginDocument{%
  \RequirePackage{hyperref}%
  \ifnopdfoutputerror
  \ifnum\pdfoutput=0
  \ClassError{quantumarticle}{Please add \string\pdfoutput=1 within the first 5 lines of the preamble of your main LaTeX file as suggested by the arXiv (https://arxiv.org/help/submit_tex). Without this, the arXiv compiles your document with latex instead of pdflatex and hyperlinks in the bibliography broken over several lines will not work properly. See http://tex.stackexchange.com/questions/182523/publishing-to-arxiv-with-hyperlinks for more information. If you still want to use standard latex (for example because you depend on psfrag) instead of pdflatex despite this problem, you can disable this error by giving the nopdfoutputerror option to quantumarticle. In this case please check carefully that the links in your document, especially in the bibliography work properly.}{}%see also http://tex.stackexchange.com/questions/341466/latex-macros-in-classwarning-or-classerror for why \string is necessary
  \fi
  \fi

  \@ifpackageloaded{natbib}{%
    \setlength{\bibsep}{0pt plus 0.3ex}
    \@ifpackageloaded{doi}{}{%
      \providecommand{\doi}[1]{}
      \renewcommand{\doi}[1]{\href{https://doi.org/\detokenize{#1}}{DOI: \detokenize{#1}}}%
    }%
  }{%
    \@ifpackageloaded{biblatex}{
      \DeclareFieldFormat{doi}{\mkbibacro{DOI}\addcolon\space\href{https://doi.org/\detokenize{#1}}{\detokenize{#1}}}
      \setcounter{biburllcpenalty}{1000}
      \setcounter{biburlucpenalty}{1000}
      \setcounter{biburlnumpenalty}{1000}
    }{}%
  }
}

\def\@keywords{}
\providecommand{\keywords}{}
\renewcommand{\keywords}[1]{\def\@keywords{#1}}

\ifamsfonts\RequirePackage{amsfonts}\fi
\ifamssymb\RequirePackage{amssymb}\fi
\ifamsmath\RequirePackage{amsmath}\fi

\ifrevtexcompatibility

\PassOptionsToPackage{numbers}{natbib}
\PassOptionsToPackage{sort&compress}{natbib}

\AtBeginDocument{%
  \providecommand{\pacs}[1]{}
  \providecommand{\preprint}[1]{}
  \providecommand{\volumeyear}[1]{}
  \providecommand{\volumenumber}[1]{}
  \providecommand{\issuenumber}[1]{}
  \providecommand{\eid}[1]{}
  \providecommand{\startpage}[1]{}
  \def\endpage#1{\gdef\@endpage{#1}}
}

\AtEndPreamble{% in compatibility mode we load natbib, but only if biblatex has not been loaded. We have to do this AtEndPreamble because natbib can not be loaded AtBeginDocument
  \@ifpackageloaded{biblatex}{}{%
    \@ifpackageloaded{natbib}{}{%
      \usepackage{natbib}
    }%
  }
  \let\@recordedbibliographystyle\relax
  \let\@origbibliographystyle\bibliographystyle
  \renewcommand{\bibliographystyle}[1]{%
    \@origbibliographystyle{#1}%
    \gdef\@recordedbibliographystyle{#1}%
  }
  \let\@origbibliography\bibliography
  \renewcommand{\bibliography}[1]{%
    \ifx\@recordedbibliographystyle\relax\bibliographystyle{plainnat}\fi
    \ltx@ifpackageloaded{natbib}{}{%
      \ltx@ifpackageloaded{biblatex}{}{%
        \ClassWarning{quantumarticle}{You are manually generating your bibliography. Please make sure that all references include DOI hyperlinks. quantumarticle recommends the use of BibTeX together with the natbib package for generating the bibliography.}}}%
    \@origbibliography{#1}}
  \providecommand\textcite[1]{\citet{#1}}
  \providecommand\onlinecite[1]{\cite{#1}}
}
\fi 

\newenvironment{acknowledgements}{\section*{Acknowledgements}}{}

\AtBeginDocument{%
  \providecommand\text[1]{
    \ClassError{quantumarticle}{To use the \string\text{} command please load the mathtools package}{}
  }
}

\PassOptionsToPackage{font={small,sf}}{caption}

\AtEndPreamble{
    \RequirePackage{caption}
}

\@blacklistpackage[You are not supposed to load custom font packages such as]{berasans}
\@blacklistpackage[You are not supposed to load custom font packages such as]{arev}
\@blacklistpackage[You are not supposed to load custom font packages such as]{avant}
\@blacklistpackage[You are not supposed to load custom font packages such as]{bera}
\@blacklistpackage[You are not supposed to load custom font packages such as]{bookman}
\@blacklistpackage[You are not supposed to load custom font packages such as]{cabin}
\@blacklistpackage[You are not supposed to load custom font packages such as]{chancery}
\@blacklistpackage[You are not supposed to load custom font packages such as]{charter}
\@blacklistpackage[You are not supposed to load custom font packages such as]{cmbright}
\@blacklistpackage[You are not supposed to load custom font packages such as]{concrete}
\@blacklistpackage[You are not supposed to load custom font packages such as]{courier}
\@blacklistpackage[You are not supposed to load custom font packages such as]{dejavu}
\@blacklistpackage[You are not supposed to load custom font packages such as]{droid}
\@blacklistpackage[You are not supposed to load custom font packages such as]{drm}
\@blacklistpackage[You are not supposed to load custom font packages such as]{ebgaramond}
\@blacklistpackage[You are not supposed to load custom font packages such as]{euler}
\@blacklistpackage[You are not supposed to load custom font packages such as]{fourier}
\@blacklistpackage[You are not supposed to load custom font packages such as]{fouriernc}
\@blacklistpackage[You are not supposed to load custom font packages such as]{gentium}
\@blacklistpackage[You are not supposed to load custom font packages such as]{helvet}
\@blacklistpackage[You are not supposed to load custom font packages such as]{inconsolata}
\@blacklistpackage[You are not supposed to load custom font packages such as]{kpfonts}
\@blacklistpackage[You are not supposed to load custom font packages such as]{lato}
\@blacklistpackage[You are not supposed to load custom font packages such as]{libertineotf}
\@blacklistpackage[You are not supposed to load custom font packages such as]{libertine}
\@blacklistpackage[You are not supposed to load custom font packages such as]{librebaskerville}
\@blacklistpackage[You are not supposed to load custom font packages such as]{lmodern}
\@blacklistpackage[You are not supposed to load custom font packages such as]{mathdesign}
\@blacklistpackage[You are not supposed to load custom font packages such as]{mathpazo}
\@blacklistpackage[You are not supposed to load custom font packages such as]{mathptmx}
\@blacklistpackage[You are not supposed to load custom font packages such as]{newcent}
\@blacklistpackage[You are not supposed to load custom font packages such as]{newtx}
\@blacklistpackage[You are not supposed to load custom font packages such as]{quattrocento}
\@blacklistpackage[You are not supposed to load custom font packages such as]{tgadventor}
\@blacklistpackage[You are not supposed to load custom font packages such as]{tgbonum}
\@blacklistpackage[You are not supposed to load custom font packages such as]{tgchorus}
\@blacklistpackage[You are not supposed to load custom font packages such as]{tgcursor}
\@blacklistpackage[You are not supposed to load custom font packages such as]{tgheros}
\@blacklistpackage[You are not supposed to load custom font packages such as]{tgpagella}
\@blacklistpackage[You are not supposed to load custom font packages such as]{tgschola}
\@blacklistpackage[You are not supposed to load custom font packages such as]{tgtermes}
\@blacklistpackage[You are not supposed to load custom font packages such as]{times}
\@blacklistpackage[You are not supposed to load custom font packages such as]{yfonts}

\endinput
%%
%% End of file `quantumarticle.cls'.